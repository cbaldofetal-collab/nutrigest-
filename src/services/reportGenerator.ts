// Serviço de geração de relatórios PDF

import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { User, DailyNutrition, WeightEntry, MealEntry } from '../types';
import { formatDate, calculateAverageNutrition } from '../utils';
import { NUTRITION_TARGETS, CRITICAL_NUTRIENTS } from '../constants';

export type ReportType = 'weekly' | 'monthly' | 'trimester' | 'custom';

export interface ReportData {
  user: User;
  startDate: Date;
  endDate: Date;
  dailyNutrition: DailyNutrition[];
  weightEntries: WeightEntry[];
  meals: MealEntry[];
  type: ReportType;
}

/**
 * Prepara dados para gráfico de calorias por refeição
 */
function prepareMealCaloriesChart(meals: MealEntry[]): {
  labels: string[];
  data: number[];
  colors: string[];
  total: number;
  hasData: boolean;
} {
  const mealCalories: Record<string, number> = {
    'Café da Manhã': 0,
    'Almoço': 0,
    'Jantar': 0,
    'Lanche': 0,
  };

  const mealColors: Record<string, string> = {
    'Café da Manhã': '#81C784',
    'Almoço': '#64B5F6',
    'Jantar': '#F48FB1',
    'Lanche': '#FFB74D',
  };

  meals.forEach((meal) => {
    const mealTypeLabels: Record<string, string> = {
      breakfast: 'Café da Manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche',
    };
    const label = mealTypeLabels[meal.mealType] || 'Outro';
    mealCalories[label] += meal.food.calories * meal.quantity;
  });

  const labels: string[] = [];
  const data: number[] = [];
  const colors: string[] = [];
  let total = 0;

  Object.keys(mealCalories).forEach((label) => {
    const calories = mealCalories[label];
    if (calories > 0) {
      labels.push(label);
      data.push(calories);
      colors.push(mealColors[label] || '#81C784');
      total += calories;
    }
  });

  return {
    labels,
    data,
    colors,
    total,
    hasData: total > 0,
  };
}

/**
 * Prepara dados para gráfico de nutrientes críticos
 */
function prepareCriticalNutrientsChart(
  averageNutrition: DailyNutrition,
  targets: any
): {
  labels: string[];
  data: number[];
  colors: string[];
} {
  const labels: string[] = [];
  const data: number[] = [];
  const colors: string[] = [];

  CRITICAL_NUTRIENTS.forEach((nutrient) => {
    const current = averageNutrition[nutrient.key as keyof DailyNutrition] as number;
    const target = targets[nutrient.key as keyof typeof targets] as number;
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const isLow = percentage < (nutrient.threshold * 100);

    labels.push(nutrient.label);
    data.push(current);
    colors.push(isLow ? '#E57373' : '#81C784');
  });

  return { labels, data, colors };
}

/**
 * Gera HTML do relatório
 */
function generateReportHTML(data: ReportData): string {
  const { user, startDate, endDate, dailyNutrition, weightEntries, type } = data;
  
  const averageNutrition = calculateAverageNutrition(dailyNutrition);
  const trimester = user.gestationalWeek <= 13 ? 1 : user.gestationalWeek <= 27 ? 2 : 3;
  const targets = NUTRITION_TARGETS[trimester as keyof typeof NUTRITION_TARGETS] || NUTRITION_TARGETS[1];

  // Análise de padrões
  const patterns = analyzePatterns(data);

  // Preparar dados para gráficos
  const mealCaloriesData = prepareMealCaloriesChart(data.meals);
  const criticalNutrientsData = prepareCriticalNutrientsChart(averageNutrition, targets);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #212121;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #81C784;
          padding-bottom: 20px;
          margin-bottom: 30px;
          margin-top: 100px;
          position: relative;
          z-index: 100;
          background-color: white;
        }
        .header h1 {
          color: #81C784;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #757575;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          background-color: #E8F5E9;
          padding: 10px;
          border-left: 4px solid #81C784;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .info-item {
          padding: 10px;
          background-color: #FAFAFA;
          border-radius: 5px;
        }
        .info-label {
          font-size: 12px;
          color: #757575;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          font-weight: bold;
          color: #212121;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #E0E0E0;
        }
        th {
          background-color: #E8F5E9;
          font-weight: bold;
        }
        .progress-bar {
          background-color: #E0E0E0;
          border-radius: 10px;
          height: 20px;
          margin: 5px 0;
          overflow: hidden;
        }
        .progress-fill {
          background-color: #81C784;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .warning {
          background-color: #FFF3E0;
          border-left: 4px solid #FFB74D;
          padding: 10px;
          margin: 10px 0;
        }
        .success {
          background-color: #E8F5E9;
          border-left: 4px solid #81C784;
          padding: 10px;
          margin: 10px 0;
        }
        .patterns {
          list-style: none;
          padding: 0;
        }
        .patterns li {
          padding: 8px;
          margin: 5px 0;
          background-color: #FAFAFA;
          border-left: 3px solid #64B5F6;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E0E0E0;
          text-align: center;
          color: #757575;
          font-size: 12px;
        }
        .close-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #81C784;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 1000;
          text-decoration: none;
          display: inline-block;
        }
        .back-link {
          position: fixed;
          top: 20px;
          left: 20px;
          background-color: #64B5F6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 1000;
          text-decoration: none;
          display: inline-block;
        }
        .close-button:hover {
          background-color: #66BB6A;
        }
        .back-link {
          position: fixed;
          top: 20px;
          left: 20px;
          background-color: #64B5F6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 1000;
          text-decoration: none;
          display: inline-block;
        }
        .back-link:hover {
          background-color: #42A5F5;
        }
        .download-button {
          position: fixed;
          top: 320px;
          right: 20px;
          background-color: #81C784;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 50;
        }
        .download-button:hover {
          background-color: #66BB6A;
        }
        .download-button:disabled {
          background-color: #BDBDBD;
          cursor: not-allowed;
        }
        @media print {
          .close-button,
          .back-link,
          .download-button {
            display: none;
          }
        }
        .chart-container {
          margin: 20px 0;
          padding: 15px;
          background-color: #FAFAFA;
          border-radius: 5px;
          page-break-inside: avoid;
        }
        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin: 20px 0;
        }
        .bar-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bar-label {
          min-width: 120px;
          font-size: 14px;
          font-weight: 500;
        }
        .bar-wrapper {
          flex: 1;
          height: 30px;
          background-color: #E0E0E0;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
        }
        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 10px;
          color: white;
          font-size: 12px;
          font-weight: bold;
          border-radius: 5px;
          transition: width 0.3s;
        }
        .bar-value {
          min-width: 80px;
          text-align: right;
          font-size: 14px;
          font-weight: 600;
        }
        .chart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 15px;
          padding: 10px;
          background-color: #F5F5F5;
          border-radius: 5px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: 3px;
        }
      </style>
    </head>
    <body>
      <button class="back-link" id="backButton">← Voltar ao Dashboard</button>
      <button class="close-button" id="closeButton">✕ Fechar</button>
      <div class="header">
        <h1>Relatório Nutricional - NutriGest</h1>
        <p>${user.name}</p>
        <p>Período: ${formatDate(startDate)} a ${formatDate(endDate)}</p>
        <p>Semana Gestacional: ${user.gestationalWeek} semanas</p>
      </div>

      <div class="section">
        <div class="section-title">Informações da Gestação</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Data Prevista</div>
            <div class="info-value">${formatDate(user.dueDate)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Trimestre</div>
            <div class="info-value">${trimester}º Trimestre</div>
          </div>
          <div class="info-item">
            <div class="info-label">Peso Inicial</div>
            <div class="info-value">${user.initialWeight.toFixed(1)} kg</div>
          </div>
          <div class="info-item">
            <div class="info-label">Peso Atual</div>
            <div class="info-value">${user.currentWeight.toFixed(1)} kg</div>
          </div>
        </div>
      </div>

      ${mealCaloriesData.hasData ? `
        <div class="section">
          <div class="section-title">Distribuição de Calorias por Refeição</div>
          <div class="chart-container">
            <div class="bar-chart">
              ${mealCaloriesData.labels.map((label, index) => {
                const value = mealCaloriesData.data[index];
                const percentage = (value / mealCaloriesData.total) * 100;
                const color = mealCaloriesData.colors[index];
                return `
                  <div class="bar-item">
                    <div class="bar-label">${label}</div>
                    <div class="bar-wrapper">
                      <div class="bar-fill" style="width: ${percentage}%; background-color: ${color};">
                        ${percentage.toFixed(0)}%
                      </div>
                    </div>
                    <div class="bar-value">${value.toFixed(0)} kcal</div>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="chart-legend">
              <strong>Total: ${mealCaloriesData.total.toFixed(0)} kcal</strong>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Médias Nutricionais do Período</div>
        <table>
          <thead>
            <tr>
              <th>Nutriente</th>
              <th>Consumo Médio</th>
              <th>Meta Diária</th>
              <th>% da Meta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Calorias</td>
              <td>${averageNutrition.calories.toFixed(0)} kcal</td>
              <td>${targets.calories} kcal</td>
              <td>${((averageNutrition.calories / targets.calories) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>Proteína</td>
              <td>${averageNutrition.protein.toFixed(1)} g</td>
              <td>${targets.protein} g</td>
              <td>${((averageNutrition.protein / targets.protein) * 100).toFixed(1)}%</td>
            </tr>
            ${CRITICAL_NUTRIENTS.map((nutrient) => {
              const current = averageNutrition[nutrient.key as keyof typeof averageNutrition] as number;
              const target = targets[nutrient.key as keyof typeof targets] as number;
              const percentage = ((current / target) * 100).toFixed(1);
              return `
                <tr>
                  <td>${nutrient.label}</td>
                  <td>${current.toFixed(1)} ${nutrient.unit}</td>
                  <td>${target} ${nutrient.unit}</td>
                  <td>${percentage}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Nutrientes Críticos</div>
        <div class="chart-container">
          <div class="bar-chart">
            ${CRITICAL_NUTRIENTS.map((nutrient) => {
              const current = averageNutrition[nutrient.key as keyof typeof averageNutrition] as number;
              const target = targets[nutrient.key as keyof typeof targets] as number;
              const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
              const isLow = percentage < (nutrient.threshold * 100);
              const color = isLow ? '#E57373' : '#81C784';
              
              return `
                <div class="bar-item">
                  <div class="bar-label">${nutrient.label}</div>
                  <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${percentage}%; background-color: ${color};">
                      ${percentage.toFixed(0)}%
                    </div>
                  </div>
                  <div class="bar-value" style="color: ${isLow ? '#E57373' : '#212121'};">
                    ${current.toFixed(1)} / ${target} ${nutrient.unit}
                    ${isLow ? ' ⚠️' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #81C784;"></div>
              <span>Adequado</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #E57373;"></div>
              <span>Abaixo da Meta</span>
            </div>
          </div>
        </div>
        ${CRITICAL_NUTRIENTS.map((nutrient) => {
          const current = averageNutrition[nutrient.key as keyof typeof averageNutrition] as number;
          const target = targets[nutrient.key as keyof typeof targets] as number;
          const percentage = Math.min((current / target) * 100, 100);
          const isLow = current < target * 0.8;
          
          return `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong>${nutrient.label}</strong>
                <span>${current.toFixed(1)} / ${target} ${nutrient.unit}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%; background-color: ${isLow ? '#E57373' : '#81C784'};">
                  ${percentage.toFixed(0)}%
                </div>
              </div>
              ${isLow ? `
                <div class="warning">
                  ⚠️ Consumo abaixo da meta recomendada
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      ${weightEntries.length > 0 ? `
        <div class="section">
          <div class="section-title">Evolução de Peso</div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Peso (kg)</th>
                <th>Ganho (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${weightEntries.slice(0, 10).map((entry) => {
                const gain = entry.weight - user.initialWeight;
                return `
                  <tr>
                    <td>${formatDate(entry.date)}</td>
                    <td>${entry.weight.toFixed(1)}</td>
                    <td>${gain > 0 ? '+' : ''}${gain.toFixed(1)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      ${patterns.length > 0 ? `
        <div class="section">
          <div class="section-title">Análise de Padrões</div>
          <ul class="patterns">
            ${patterns.map((pattern) => `<li>${pattern}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Recomendações</div>
        ${generateRecommendations(data, averageNutrition, targets).map((rec) => `
          <div class="success">
            ✓ ${rec}
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <p>Relatório gerado pelo NutriGest em ${formatDate(new Date())}</p>
        <p>Este relatório é apenas informativo e não substitui a orientação médica profissional.</p>
      </div>

      <script>
        // Funções globais para os botões
        function redirectToDashboard() {
          const targetUrl = 'http://localhost:8081';
          console.log('Redirecionando para:', targetUrl);
          window.location.href = targetUrl;
        }

        function goBack() {
          console.log('goBack chamado');
          try {
            if (window.opener && !window.opener.closed) {
              window.close();
              return;
            }
            redirectToDashboard();
          } catch (error) {
            console.error('Erro:', error);
            redirectToDashboard();
          }
        }

        function closeWindow() {
          console.log('closeWindow chamado');
          try {
            if (window.opener && !window.opener.closed) {
              window.close();
              return;
            }
            redirectToDashboard();
          } catch (error) {
            console.error('Erro:', error);
            redirectToDashboard();
          }
        }

        // Configurar botões quando o DOM estiver pronto
        function setupButtons() {
          const backButton = document.getElementById('backButton');
          if (backButton) {
            backButton.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              goBack();
              return false;
            };
            console.log('Botão voltar configurado');
          }

          const closeButton = document.getElementById('closeButton');
          if (closeButton) {
            closeButton.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              closeWindow();
              return false;
            };
            console.log('Botão fechar configurado');
          }
        }

        // Tentar configurar imediatamente
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', setupButtons);
        } else {
          setupButtons();
        }

        // Também tentar após delays para garantir
        setTimeout(setupButtons, 100);
        setTimeout(setupButtons, 500);
        setTimeout(setupButtons, 1000);

        async function downloadPDF() {
          const button = document.querySelector('.download-button');
          if (button) {
            button.disabled = true;
            button.textContent = '⏳ Gerando PDF...';
          }

          try {
            // Verificar se html2pdf está disponível
            const html2pdfLib = window.html2pdf;
            if (html2pdfLib && typeof html2pdfLib === 'function') {
              // Usar html2pdf.js para gerar PDF diretamente
              const element = document.body;
              const opt = {
                margin: 0.5,
                filename: 'relatorio-nutrigest.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
              };

              await html2pdfLib().set(opt).from(element).save();
              
              if (button) {
                button.textContent = '✅ PDF Baixado!';
                setTimeout(() => {
                  button.disabled = false;
                  button.textContent = '📥 Baixar PDF';
                }, 2000);
              }
            } else {
              // Fallback: usar window.print()
              window.print();
              if (button) {
                button.disabled = false;
                button.textContent = '📥 Baixar PDF';
              }
            }
          } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            // Fallback: usar window.print()
            window.print();
            if (button) {
              button.disabled = false;
              button.textContent = '📥 Baixar PDF';
            }
          }
        }

        // Configurar botões quando a página carregar
        window.onload = function() {
          // Configurar botões de voltar e fechar
          const backButton = document.getElementById('backButton');
          if (backButton) {
            backButton.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              goBack();
              return false;
            };
          }

          const closeButton = document.getElementById('closeButton');
          if (closeButton) {
            closeButton.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              closeWindow();
              return false;
            };
          }

          // Criar botão de download
          setTimeout(() => {
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '📥 Baixar PDF';
            downloadBtn.className = 'download-button';
            downloadBtn.onclick = function(e) {
              e.preventDefault();
              downloadPDF();
            };
            downloadBtn.title = 'Clique para baixar o relatório como PDF';
            document.body.insertBefore(downloadBtn, document.body.firstChild);
          }, 500);
        };

        // Também configurar quando o DOM estiver pronto (fallback)
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            const backButton = document.getElementById('backButton');
            if (backButton && !backButton.onclick) {
              backButton.onclick = function(e) {
                e.preventDefault();
                goBack();
                return false;
              };
            }
            const closeButton = document.getElementById('closeButton');
            if (closeButton && !closeButton.onclick) {
              closeButton.onclick = function(e) {
                e.preventDefault();
                closeWindow();
                return false;
              };
            }
          });
        }

        // Adicionar atalho de teclado ESC para fechar
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            closeWindow();
          }
        });
      </script>
    </body>
    </html>
  `;

  return html;
}

/**
 * Analisa padrões nos dados
 */
function analyzePatterns(data: ReportData): string[] {
  const patterns: string[] = [];
  const { dailyNutrition, meals } = data;

  if (dailyNutrition.length === 0) return patterns;

  // Análise de distribuição calórica
  const mealDistribution = analyzeMealDistribution(meals);
  if (mealDistribution.highBreakfast) {
    patterns.push('Alto consumo calórico no café da manhã');
  }
  if (mealDistribution.lowDinner) {
    patterns.push('Baixo consumo calórico no jantar');
  }

  // Análise de consistência
  const avgCalories = dailyNutrition.reduce((sum, day) => sum + day.calories, 0) / dailyNutrition.length;
  const variance = dailyNutrition.reduce((sum, day) => sum + Math.pow(day.calories - avgCalories, 2), 0) / dailyNutrition.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev / avgCalories > 0.3) {
    patterns.push('Variação significativa no consumo diário de calorias');
  }

  // Análise de hidratação
  const avgWater = dailyNutrition.reduce((sum, day) => sum + day.water, 0) / dailyNutrition.length;
  if (avgWater < 2000) {
    patterns.push('Baixa ingestão média de água');
  }

  return patterns;
}

/**
 * Analisa distribuição de refeições
 */
function analyzeMealDistribution(meals: MealEntry[]): {
  highBreakfast: boolean;
  lowDinner: boolean;
} {
  const mealCalories = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  };

  meals.forEach((meal) => {
    const calories = meal.food.calories * meal.quantity;
    mealCalories[meal.mealType] += calories;
  });

  const total = Object.values(mealCalories).reduce((sum, val) => sum + val, 0);
  if (total === 0) return { highBreakfast: false, lowDinner: false };

  const breakfastPercent = (mealCalories.breakfast / total) * 100;
  const dinnerPercent = (mealCalories.dinner / total) * 100;

  return {
    highBreakfast: breakfastPercent > 35,
    lowDinner: dinnerPercent < 20,
  };
}

/**
 * Gera recomendações baseadas nos dados
 */
function generateRecommendations(
  data: ReportData,
  averageNutrition: DailyNutrition,
  targets: any
): string[] {
  const recommendations: string[] = [];

  // Verificar nutrientes críticos
  CRITICAL_NUTRIENTS.forEach((nutrient) => {
    const current = averageNutrition[nutrient.key as keyof typeof averageNutrition] as number;
    const target = targets[nutrient.key as keyof typeof targets] as number;
    
    if (current < target * 0.8) {
      recommendations.push(
        `Aumentar o consumo de ${nutrient.label}. Considere incluir alimentos ricos em ${nutrient.label} nas refeições.`
      );
    }
  });

  // Verificar proteína
  if (averageNutrition.protein < targets.protein * 0.9) {
    recommendations.push(
      'Aumentar o consumo de proteínas. Inclua fontes como carnes magras, ovos, leguminosas e laticínios.'
    );
  }

  // Verificar hidratação
  if (averageNutrition.water < 2000) {
    recommendations.push(
      'Aumentar a ingestão de água. Beba pelo menos 2,5 litros por dia.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue mantendo uma alimentação balanceada e variada.');
  }

  return recommendations;
}

/**
 * Gera e salva o relatório PDF
 */
export async function generateReportPDF(data: ReportData): Promise<string> {
  try {
    const html = generateReportHTML(data);
    
    // No web, usar window.print() diretamente
    if (Platform.OS === 'web') {
      return await generatePDFForWeb(html);
    }
    
    // Em mobile, usar expo-print
    const { uri } = await Print.printToFileAsync({ 
      html,
      base64: false,
    });
    
    console.log('PDF gerado com sucesso:', uri);
    return uri;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error(`Não foi possível gerar o relatório PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Gera PDF no web usando window.print() com opção de download
 */
async function generatePDFForWeb(html: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Verificar se estamos no navegador
      if (typeof window === 'undefined') {
        reject(new Error('window não está disponível'));
        return;
      }

      // Criar uma nova janela com o HTML
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        reject(new Error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.'));
        return;
      }

      printWindow.document.write(html);
      printWindow.document.close();

      // Aguardar o conteúdo carregar
      printWindow.onload = () => {
        // Adicionar botão de download de PDF
        addDownloadButton(printWindow);
        resolve('web-print://report');
      };

      // Fallback caso onload não dispare
      setTimeout(() => {
        if (printWindow.document.readyState === 'complete') {
          addDownloadButton(printWindow);
          resolve('web-print://report');
        }
      }, 500);
    } catch (error) {
      console.error('Erro ao gerar PDF no web:', error);
      reject(error);
    }
  });
}

/**
 * Adiciona botão de download de PDF na janela
 */
function addDownloadButton(printWindow: Window) {
  try {
    const downloadButton = printWindow.document.createElement('button');
    downloadButton.textContent = '📥 Baixar PDF';
    downloadButton.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #81C784;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 1000;
    `;
    downloadButton.onclick = () => {
      printWindow.print();
    };
    printWindow.document.body.insertBefore(downloadButton, printWindow.document.body.firstChild);
  } catch (error) {
    console.error('Erro ao adicionar botão de download:', error);
  }
}

/**
 * Compartilha o relatório PDF
 */
export async function shareReportPDF(pdfUri: string): Promise<void> {
  try {
    // No web, o PDF já foi impresso, então não precisa compartilhar
    if (Platform.OS === 'web') {
      console.log('PDF gerado no navegador. Use a opção "Salvar como PDF" na janela de impressão.');
      return;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Compartilhamento não disponível neste dispositivo');
    }
    await Sharing.shareAsync(pdfUri);
  } catch (error) {
    console.error('Erro ao compartilhar PDF:', error);
    // No web, não é um erro crítico se o compartilhamento falhar
    if (Platform.OS === 'web') {
      console.log('Compartilhamento não disponível no web, mas o PDF foi gerado.');
      return;
    }
    throw new Error('Não foi possível compartilhar o relatório');
  }
}


