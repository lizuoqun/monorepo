import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * MCP 代码安全审计
 * @param {string} projectRoot 项目根目录
 * @param {string} savePath 保存路径
 * @author: modify
 * */
const auditPackage = async (projectRoot, savePath) => {
  // 创建工作目录
  const workDir = await createWorkDir();
  console.log('工作目录:', workDir);
  // 项目解析，向工作目录添加package.json
  const packageJson = await parseProject(projectRoot);
  console.log('package.json已生成');
  // 生成锁文件
  await generateLock(workDir, packageJson);
  console.log('锁文件已生成');
  await audit(workDir, savePath);
  // 通过模版生成报告
  await generateReport(workDir, savePath);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workBasePath = path.join(__dirname, 'work');
const createWorkDir = async () => {
  const workDir = path.join(workBasePath);
  await fs.promises.mkdir(workDir, { recursive: true });
  return workDir;
};

/**
 * @param {string} projectRoot 项目根目录
 * @return {object} package.json
 * */
const EXTERNAL_LINK_HTTP = 'http://';
const EXTERNAL_LINK_HTTPS = 'https://';
const parseProject = async projectRoot => {
  if (projectRoot.startsWith(EXTERNAL_LINK_HTTP) || projectRoot.startsWith(EXTERNAL_LINK_HTTPS)) {
    return parseRemoteProject(projectRoot);
  }
  return parseLocalProject(projectRoot);
};

const parseLocalProject = async projectRoot => {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const json = await fs.promises.readFile(packageJsonPath, 'utf-8');
  return JSON.parse(json);
};

const parseRemoteProject = async url => {
  console.log('开始解析远程项目:', url);
  // TODO: 实现远程项目解析
  throw new Error('远程项目解析尚未实现');
};

let projectName = '';
const generateLock = async (workDir, packageJson) => {
  // 只保留指定的属性
  const allowedKeys = [
    'name',
    'version',
    'description',
    'main',
    'scripts',
    'repository',
    'keywords',
    'author',
    'license',
    'dependencies'
  ];
  const filteredPackageJson = {};

  allowedKeys.forEach(key => {
    if (packageJson[key] !== undefined) {
      filteredPackageJson[key] = packageJson[key];
    }
  });

  // 写入 package.json
  // await fs.promises.writeFile(path.join(workDir, 'package.json'), JSON.stringify(filteredPackageJson, null, 2));
  await fs.promises.writeFile(path.join(workDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  projectName = filteredPackageJson.name;
  // 生成 lock 文件
  await createLockFile(workDir);
};

const createLockFile = async workDir => {
  const cmd = `npm install --package-lock-only --force`;
  await runCommand(cmd, workDir);
};

/**
 * 执行命令行命令
 * @param {string} command 要执行的命令
 * @param {string} cwd 工作目录
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
const runCommand = async (command, cwd) => {
  const { stdout, stderr } = await execAsync(command, {
    cwd,
    maxBuffer: 1024 * 1024 * 10 * 10 // 100MB buffer
  });

  if (stderr) {
    console.error('命令执行警告:', stderr);
  }

  return { stdout, stderr };
};

const audit = async (workDir, savePath) => {
  console.log('开始执行命令:', workDir);
  const cmd = `npm audit --json`;
  try {
    const { stdout } = await runCommand(cmd, workDir);
    const auditResult = JSON.parse(stdout);

    await fs.promises.mkdir(savePath, { recursive: true });
    const resultPath = path.join(savePath, `audit-result.json`);
    await fs.promises.writeFile(resultPath, JSON.stringify(auditResult, null, 2));

    console.log(`安全审计完成，结果已保存到：${resultPath}`);
  } catch (error) {
    if (error.stdout) {
      const rawOutputPath = path.join(savePath, `audit-result.json`);
      await fs.promises.mkdir(savePath, { recursive: true });
      await fs.promises.writeFile(rawOutputPath, error.stdout);
      console.log(`原始输出已保存到：${rawOutputPath}`);
    }
  }
};

const generateReport = async (workDir, savePath) => {
  // 确保保存目录存在
  await fs.promises.mkdir(savePath, { recursive: true });

  // 查找最新的审计结果文件
  const files = await fs.promises.readdir(savePath);
  const auditResultFiles = files.filter(file => file.startsWith('audit-result') && file.endsWith('.json'));

  if (auditResultFiles.length === 0) {
    throw new Error('未找到审计结果文件');
  }

  // 获取最新的审计结果文件
  const latestFile = auditResultFiles.sort().pop();
  const resultPath = path.join(savePath, latestFile);
  const auditResult = JSON.parse(await fs.promises.readFile(resultPath, 'utf-8'));

  // 生成 Markdown 报告
  let report = `# 安全审计报告 ${projectName}\n\n`;
  report += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;
  report += `**审计文件**: ${latestFile}\n\n`;

  // 摘要信息
  report += `## 摘要\n\n`;
  if (auditResult.metadata) {
    report += `- **总依赖包数量**: ${auditResult.metadata.dependencies.total || 0}\n`;
  }
  report += `\n`;

  // 漏洞统计
  const vulnerabilities = auditResult.vulnerabilities || {};
  const vulnKeys = Object.keys(vulnerabilities);

  report += `## 漏洞统计\n\n`;
  report += `**发现漏洞数量**: ${vulnKeys.length}\n\n`;

  if (vulnKeys.length > 0) {
    // 按严重程度分类统计
    const severityCount = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
    vulnKeys.forEach(name => {
      const severity = vulnerabilities[name].severity;
      if (severityCount[severity] !== undefined) {
        severityCount[severity]++;
      }
    });

    report += `### 按严重程度分布\n\n`;
    report += `| 严重程度 | 数量 |\n`;
    report += `|---------|------|\n`;
    report += `| Critical | ${severityCount.critical} |\n`;
    report += `| High | ${severityCount.high} |\n`;
    report += `| Moderate | ${severityCount.moderate} |\n`;
    report += `| Low | ${severityCount.low} |\n`;
    report += `| Info | ${severityCount.info} |\n`;
    report += `\n`;

    // 详细漏洞信息
    report += `## 漏洞详情\n\n`;

    // 按严重程度排序
    const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };
    vulnKeys.sort((a, b) => severityOrder[vulnerabilities[a].severity] - severityOrder[vulnerabilities[b].severity]);

    vulnKeys.forEach(name => {
      const vuln = vulnerabilities[name];
      report += `### ${name}\n\n`;
      report += `- **严重程度**: ${getSeverityBadge(vuln.severity)}\n`;
      report += `- **受影响版本**: ${vuln.vulnerable_versions || '--'}\n`;
      report += `- **修复版本**: ${vuln.fixed_in || '--'}\n`;

      if (vuln.access) {
        report += `- **访问类型**: ${vuln.access}\n`;
      }

      // 处理 via 属性的两种格式
      if (vuln.via && vuln.via.length > 0) {
        // 检查是字符串数组还是对象数组
        if (typeof vuln.via[0] === 'string') {
          report += `- **漏洞来源**: ${vuln.via.join(', ')}\n`;
        } else if (typeof vuln.via[0] === 'object') {
          report += `- **漏洞来源**:\n\n`;
          vuln.via.forEach((viaItem, index) => {
            report += `  #### ${index + 1}. ${viaItem.title || viaItem.name}\n\n`;
            report += `  - **参考链接**: [查看](${viaItem.url || '--'})\n`;
            report += `  - **CVSS 评分**: ${viaItem.cvss.score || '--'}`;
            report += ` (${viaItem.cvss.vectorString || '--'})\n`;
            if (viaItem.cwe && viaItem.cwe.length > 0) {
              report += `  - **漏洞类型**: ${viaItem.cwe.join(', ')}\n`;
            }
            report += `  - **严重程度**: ${getSeverityBadge(viaItem.severity) || '--'}\n`;
            report += `  - **影响范围**: ${viaItem.range || '--'}\n`;
            report += `\n`;
          });
        }
      }

      report += `**描述**:\n${vuln.description || '--'}\n\n`;
      report += `**建议**:\n${vuln.recommendation || '--'}\n\n`;

      report += `---\n\n`;
    });
  } else {
    report += `🎉 **未发现安全漏洞！**\n\n`;
  }

  // 保存报告
  const reportPath = path.join(savePath, `audit-report.md`);
  await fs.promises.writeFile(reportPath, report);

  console.log(`审计报告已生成：${reportPath}`);
  return reportPath;
};

/**
 * 获取严重程度徽章
 */
const getSeverityBadge = severity => {
  const badges = {
    critical: '🔴 Critical',
    high: '🟠 High',
    moderate: '🟡 Moderate',
    low: '🟢 Low',
    info: 'ℹ️ Info'
  };
  return badges[severity] || severity;
};

// auditPackage('D:\\mygit\\Vue3\\web-vite-vue3', 'D:\\mygit\\Vue3\\web-vite-vue3\\audit');

auditPackage('D:\\mygit\\Vue3\\web-vite-vue3', './work');

// generateReport('./work', './work');
