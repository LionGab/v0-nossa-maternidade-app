#!/usr/bin/env node
/**
 * 📊 Report Generator - Gerador de Relatórios Combinados
 * Combina relatórios de múltiplas fontes em um relatório unificado
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, '..');
const REPORTS_DIR = join(PROJECT_ROOT, 'reports');

/**
 * Busca arquivos JSON em um diretório
 */
function findJsonFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const files = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...findJsonFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Erro ao ler diretório ${dir}: ${error.message}`);
  }

  return files;
}

/**
 * Lê e parseia JSON de forma segura
 */
function readJsonSafe(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Erro ao ler JSON ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Prioriza problemas por severidade
 */
function prioritizeIssues(issues) {
  const priorityOrder = {
    'critical': 0,
    'high': 1,
    'medium': 2,
    'low': 3,
    'info': 4
  };

  return issues.sort((a, b) => {
    const aPriority = priorityOrder[a.severity?.toLowerCase()] ?? 999;
    const bPriority = priorityOrder[b.severity?.toLowerCase()] ?? 999;
    return aPriority - bPriority;
  });
}

/**
 * Gera relatório em Markdown
 */
function generateMarkdownReport(combinedReport) {
  const lines = [];

  lines.push('# 📊 Relatório Combinado - Análise Noturna');
  lines.push('');
  lines.push(`**Data:** ${combinedReport.timestamp}`);
  lines.push(`**Status Geral:** ${combinedReport.overallStatus}`);
  lines.push('');

  // Resumo Executivo
  lines.push('## 📋 Resumo Executivo');
  lines.push('');
  lines.push(`- ✅ Testes: ${combinedReport.summary.tests?.passed || 0}/${combinedReport.summary.tests?.total || 0} passando`);
  lines.push(`- 🔍 Análises: ${combinedReport.summary.analyses?.total || 0} realizadas`);
  lines.push(`- ⚠️ Problemas: ${combinedReport.summary.issues?.total || 0} encontrados`);
  lines.push(`- 🔒 Segurança: ${combinedReport.summary.security?.vulnerabilities || 0} vulnerabilidades`);
  lines.push('');

  // Testes
  if (combinedReport.sources.tests) {
    lines.push('## 🧪 Resultados dos Testes');
    lines.push('');

    if (combinedReport.sources.tests.success) {
      lines.push('✅ **Status:** Todos os testes passaram');
    } else {
      lines.push('❌ **Status:** Alguns testes falharam');
    }

    if (combinedReport.sources.tests.summary) {
      lines.push('');
      lines.push('```json');
      lines.push(JSON.stringify(combinedReport.sources.tests.summary, null, 2));
      lines.push('```');
    }

    lines.push('');
  }

  // Análise de Código
  if (combinedReport.sources.codeAnalysis) {
    lines.push('## 🔍 Análise de Código');
    lines.push('');

    if (combinedReport.sources.codeAnalysis.analysis) {
      for (const analysis of combinedReport.sources.codeAnalysis.analysis) {
        lines.push(`### ${analysis.type || 'Análise'}`);
        lines.push('');
        lines.push(analysis.content || 'Sem conteúdo');
        lines.push('');
      }
    }

    if (combinedReport.sources.codeAnalysis.errors?.length > 0) {
      lines.push('### ⚠️ Erros Encontrados');
      lines.push('');
      for (const error of combinedReport.sources.codeAnalysis.errors) {
        lines.push(`- ${error}`);
      }
      lines.push('');
    }
  }

  // Copilot
  if (combinedReport.sources.copilot) {
    lines.push('## 🤖 Análise do GitHub Copilot');
    lines.push('');

    if (combinedReport.sources.copilot.output) {
      lines.push('### Sugestões e Análises');
      lines.push('');
      lines.push('```');
      lines.push(combinedReport.sources.copilot.output);
      lines.push('```');
      lines.push('');
    }

    if (!combinedReport.sources.copilot.success) {
      lines.push(`⚠️ **Erro:** ${combinedReport.sources.copilot.error || 'Erro desconhecido'}`);
      lines.push('');
    }
  }

  // Problemas Priorizados
  if (combinedReport.issues?.length > 0) {
    lines.push('## 🚨 Problemas Priorizados');
    lines.push('');

    const prioritized = prioritizeIssues(combinedReport.issues);

    for (const issue of prioritized) {
      const severity = issue.severity?.toUpperCase() || 'UNKNOWN';
      const emoji = {
        'CRITICAL': '🔴',
        'HIGH': '🟠',
        'MEDIUM': '🟡',
        'LOW': '🟢',
        'INFO': 'ℹ️'
      }[severity] || '⚪';

      lines.push(`### ${emoji} ${issue.title || 'Problema sem título'}`);
      lines.push('');
      lines.push(`**Severidade:** ${severity}`);
      lines.push(`**Fonte:** ${issue.source || 'Desconhecida'}`);
      lines.push('');

      if (issue.description) {
        lines.push(issue.description);
        lines.push('');
      }

      if (issue.suggestion) {
        lines.push('**Sugestão:**');
        lines.push(issue.suggestion);
        lines.push('');
      }
    }
  }

  // Recomendações
  lines.push('## 💡 Recomendações');
  lines.push('');

  if (combinedReport.recommendations?.length > 0) {
    for (let i = 0; i < combinedReport.recommendations.length; i++) {
      lines.push(`${i + 1}. ${combinedReport.recommendations[i]}`);
    }
  } else {
    lines.push('Nenhuma recomendação específica no momento.');
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}*`);

  return lines.join('\n');
}

/**
 * Função principal
 */
async function main() {
  const dateStamp = process.argv[2] || new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = join(REPORTS_DIR, dateStamp);

  console.log('📊 Gerando relatório combinado...\n');
  console.log(`📁 Diretório: ${reportDir}\n`);

  // Estrutura do relatório combinado
  const combinedReport = {
    timestamp: new Date().toISOString(),
    dateStamp: dateStamp,
    overallStatus: 'success',
    sources: {},
    summary: {
      tests: {},
      analyses: {},
      issues: {},
      security: {}
    },
    issues: [],
    recommendations: []
  };

  // Carregar relatórios do Copilot
  const copilotDir = join(reportDir, 'copilot');
  const copilotFiles = findJsonFiles(copilotDir);

  if (copilotFiles.length > 0) {
    const latestCopilot = copilotFiles.sort().reverse()[0];
    const copilotData = readJsonSafe(latestCopilot);

    if (copilotData) {
      combinedReport.sources.copilot = copilotData;

      if (!copilotData.success) {
        combinedReport.overallStatus = 'partial';
        combinedReport.issues.push({
          title: 'Falha na análise do Copilot',
          description: copilotData.error || 'Erro desconhecido',
          severity: 'medium',
          source: 'copilot'
        });
      }
    }
  }

  // Carregar relatórios do Code Analyzer
  const codeAnalyzerDir = join(reportDir, 'code-analyzer');
  const analyzerFiles = findJsonFiles(codeAnalyzerDir);

  if (analyzerFiles.length > 0) {
    const latestAnalyzer = analyzerFiles.sort().reverse()[0];
    const analyzerData = readJsonSafe(latestAnalyzer);

    if (analyzerData) {
      combinedReport.sources.codeAnalysis = analyzerData;
      combinedReport.summary.analyses.total = analyzerData.filesAnalyzed || 0;

      if (analyzerData.analysis) {
        for (const analysis of analyzerData.analysis) {
          // Extrair problemas da análise
          const content = analysis.content || '';

          // Procurar por problemas mencionados
          const problemMatches = content.match(/(problema|bug|erro|issue)/gi);
          if (problemMatches) {
            combinedReport.summary.issues.total = (combinedReport.summary.issues.total || 0) + problemMatches.length;
          }
        }
      }

      if (analyzerData.errors?.length > 0) {
        combinedReport.overallStatus = 'partial';
      }
    }
  }

  // Carregar resultados de testes
  const testsDir = join(reportDir, 'tests');
  const testFiles = findJsonFiles(testsDir);

  if (testFiles.length > 0) {
    const latestTest = testFiles.sort().reverse()[0];
    const testData = readJsonSafe(latestTest);

    if (testData) {
      combinedReport.sources.tests = testData;
      combinedReport.summary.tests = {
        passed: testData.passed || 0,
        failed: testData.failed || 0,
        total: testData.total || 0
      };

      if (!testData.success || testData.failed > 0) {
        combinedReport.overallStatus = 'partial';
        combinedReport.issues.push({
          title: `${testData.failed || 0} testes falharam`,
          description: 'Verifique os detalhes nos relatórios de teste',
          severity: 'high',
          source: 'tests'
        });
      }
    }
  }

  // Gerar recomendações
  if (combinedReport.summary.tests.failed > 0) {
    combinedReport.recommendations.push('Corrigir testes que falharam antes de fazer deploy');
  }

  if (combinedReport.summary.issues.total > 0) {
    combinedReport.recommendations.push('Revisar e corrigir problemas identificados nas análises de código');
  }

  if (combinedReport.summary.security?.vulnerabilities > 0) {
    combinedReport.recommendations.push('Corrigir vulnerabilidades de segurança encontradas');
  }

  if (combinedReport.overallStatus === 'success') {
    combinedReport.recommendations.push('✅ Tudo parece estar funcionando bem! Continue mantendo a qualidade do código.');
  }

  // Salvar relatório JSON
  const jsonOutputPath = join(reportDir, 'combined-report.json');
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(jsonOutputPath, JSON.stringify(combinedReport, null, 2), 'utf-8');
  console.log(`✅ Relatório JSON salvo em: ${jsonOutputPath}`);

  // Gerar e salvar relatório Markdown
  const markdownReport = generateMarkdownReport(combinedReport);
  const mdOutputPath = join(reportDir, 'combined-report.md');
  writeFileSync(mdOutputPath, markdownReport, 'utf-8');
  console.log(`✅ Relatório Markdown salvo em: ${mdOutputPath}\n`);

  // Resumo no console
  console.log('📊 Resumo:');
  console.log(`   Status: ${combinedReport.overallStatus}`);
  console.log(`   Testes: ${combinedReport.summary.tests.passed || 0}/${combinedReport.summary.tests.total || 0}`);
  console.log(`   Problemas: ${combinedReport.summary.issues.total || 0}`);
  console.log(`   Recomendações: ${combinedReport.recommendations.length}`);
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
