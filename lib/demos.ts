import { v4 as uuidv4 } from 'uuid'

import { StudyContext, UploadedFile } from '@/types'

export interface DemoPreset {
  id: string
  label: string
  emoji: string
  description: string
  context: StudyContext
  files: UploadedFile[]
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'academic',
    label: 'Academic',
    emoji: 'academic',
    description: "Blood biomarker study in Parkinson's disease",
    context: {
      title: 'Blood Biomarkers as Diagnostic Indicators in Parkinson’s Disease',
      population:
        'Adults aged 50-85 categorized as Control, prodromal Parkinsonian symptoms, and Parkinson’s Disease (N=245)',
      primaryOutcome:
        'Which blood biomarkers best discriminate between Parkinson’s disease and control groups and correlate with motor symptom severity',
      statisticalMethods: 'Linear regression, ROC curve analysis, R 4.3.1 with lm() and pROC packages',
      outputTone: 'academic',
      outputSections: ['methods', 'results'],
    },
    files: [
      {
        id: uuidv4(),
        name: 'biomarker_analysis.txt',
        type: 'text',
        rawContent: `Linear Regression: Biomarker ~ Disease Severity (MMSE)

GFAP:     β = 1.42, SE = 0.31, t = 4.58, p < .001, 95% CI [0.81, 2.03]
NfL:      β = 1.28, SE = 0.29, t = 4.41, p < .001, 95% CI [0.71, 1.85]
Aβ42:     β = -1.67, SE = 0.35, t = -4.77, p < .001, 95% CI [-2.36, -0.98]
pTau181:  β = 1.53, SE = 0.33, t = 4.64, p < .001, 95% CI [0.88, 2.18]
tTau:     β = 1.19, SE = 0.28, t = 4.25, p < .001, 95% CI [0.64, 1.74]

ROC Curve Analysis (Classifier: AD vs Control)
GFAP:     AUC = 0.871, Sensitivity = 0.812, Specificity = 0.834
NfL:      AUC = 0.843, Sensitivity = 0.798, Specificity = 0.801
Aβ42:     AUC = 0.889, Sensitivity = 0.831, Specificity = 0.852
pTau181:  AUC = 0.901, Sensitivity = 0.847, Specificity = 0.863
tTau:     AUC = 0.856, Sensitivity = 0.809, Specificity = 0.821

Sample: N=245 (Control n=82, MCI n=79, AD n=84)
Mean age: 68.4 (SD=9.2), 54% female
Software: R 4.3.1, packages: lm(), pROC, ggplot2`,
        parsedContent: `R MODEL OUTPUT:
Linear Regression: Biomarker ~ Disease Severity (MMSE)

GFAP:     β = 1.42, SE = 0.31, t = 4.58, p < .001, 95% CI [0.81, 2.03]
NfL:      β = 1.28, SE = 0.29, t = 4.41, p < .001, 95% CI [0.71, 1.85]
Aβ42:     β = -1.67, SE = 0.35, t = -4.77, p < .001, 95% CI [-2.36, -0.98]
pTau181:  β = 1.53, SE = 0.33, t = 4.64, p < .001, 95% CI [0.88, 2.18]
tTau:     β = 1.19, SE = 0.28, t = 4.25, p < .001, 95% CI [0.64, 1.74]

ROC Curve Analysis (Classifier: AD vs Control)
GFAP:     AUC = 0.871, Sensitivity = 0.812, Specificity = 0.834
NfL:      AUC = 0.843, Sensitivity = 0.798, Specificity = 0.801
Aβ42:     AUC = 0.889, Sensitivity = 0.831, Specificity = 0.852
pTau181:  AUC = 0.901, Sensitivity = 0.847, Specificity = 0.863
tTau:     AUC = 0.856, Sensitivity = 0.809, Specificity = 0.821

Sample: N=245 (Control n=82, MCI n=79, AD n=84)
Mean age: 68.4 (SD=9.2), 54% female
Software: R 4.3.1, packages: lm(), pROC, ggplot2`,
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    emoji: 'business',
    description: 'FY2024 regional revenue performance analysis',
    context: {
      title: 'FY2024 Regional Revenue Performance Analysis',
      population: 'Three global regions (North America, APAC, EMEA) across four quarters of FY2024',
      primaryOutcome:
        'Which regions drove growth, what patterns explain performance variance, and where should resources be allocated in FY2025',
      statisticalMethods: 'Year-over-year growth analysis, regional comparison, trend analysis across Q1-Q4',
      outputTone: 'business',
      outputSections: ['executive_summary', 'findings', 'recommendations'],
    },
    files: [
      {
        id: uuidv4(),
        name: 'fy2024_revenue.csv',
        type: 'csv',
        rawContent: `Quarter,Region,Revenue_M,YoY_Growth_Pct,Customer_Acquisition,Churn_Rate_Pct,Net_Promoter_Score
Q1_2024,North America,142.3,8.2,1823,4.2,51
Q1_2024,APAC,89.7,21.4,2341,3.8,58
Q1_2024,EMEA,76.4,5.1,987,5.1,44
Q2_2024,North America,158.9,11.3,2104,3.9,54
Q2_2024,APAC,103.2,28.7,2876,3.2,62
Q2_2024,EMEA,81.2,6.8,1102,4.8,47
Q3_2024,North America,171.4,13.7,2389,3.6,57
Q3_2024,APAC,118.6,34.2,3201,2.9,65
Q3_2024,EMEA,84.7,8.3,1243,4.5,49
Q4_2024,North America,189.2,16.1,2687,3.3,59
Q4_2024,APAC,134.9,39.8,3687,2.6,68
Q4_2024,EMEA,91.3,10.2,1389,4.2,52`,
        parsedContent: `CSV TABLE DATA:
Quarter,Region,Revenue_M,YoY_Growth_Pct,Customer_Acquisition,Churn_Rate_Pct,Net_Promoter_Score
Q1_2024,North America,142.3,8.2,1823,4.2,51
Q1_2024,APAC,89.7,21.4,2341,3.8,58
Q1_2024,EMEA,76.4,5.1,987,5.1,44
Q2_2024,North America,158.9,11.3,2104,3.9,54
Q2_2024,APAC,103.2,28.7,2876,3.2,62
Q2_2024,EMEA,81.2,6.8,1102,4.8,47
Q3_2024,North America,171.4,13.7,2389,3.6,57
Q3_2024,APAC,118.6,34.2,3201,2.9,65
Q3_2024,EMEA,84.7,8.3,1243,4.5,49
Q4_2024,North America,189.2,16.1,2687,3.3,59
Q4_2024,APAC,134.9,39.8,3687,2.6,68
Q4_2024,EMEA,91.3,10.2,1389,4.2,52`,
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical',
    emoji: 'technical',
    description: 'ML dispatch algorithm A/B test results',
    context: {
      title: 'ML Dispatch Algorithm A/B Test - v2.1 vs Control',
      population: '124,832 users randomized across control and treatment groups over 90-day test period',
      primaryOutcome:
        'Does ML-optimized dispatch v2.1 significantly improve ride completion rate and key secondary metrics vs standard algorithm',
      statisticalMethods: 'Two-sample z-test, subgroup analysis, 90-day randomized controlled experiment',
      outputTone: 'technical',
      outputSections: ['approach', 'findings', 'limitations'],
    },
    files: [
      {
        id: uuidv4(),
        name: 'ab_test_results.txt',
        type: 'text',
        rawContent: `A/B Test Results: Ride Completion Rate Optimization
Test Period: 90 days, N=124,832 users

Group Assignment:
Control (n=62,401): Standard dispatch algorithm
Treatment (n=62,431): ML-optimized dispatch v2.1

Primary Metric: Ride Completion Rate
Control:   73.2% (SE=0.18%)
Treatment: 78.6% (SE=0.17%)
Absolute lift: +5.4pp
Relative lift: +7.4%
Z-statistic: 21.4, p < .001, 95% CI [4.98pp, 5.82pp]

Secondary Metrics:
Driver ETA (minutes):
Control: 6.8 (SD=2.1), Treatment: 5.9 (SD=1.9)
Δ = -0.9 min, p < .001, 95% CI [-1.02, -0.78]

Cancellation Rate:
Control: 18.3%, Treatment: 14.1%
Δ = -4.2pp, p < .001, 95% CI [-4.71pp, -3.69pp]

Session-to-Ride Conversion:
Control: 61.4%, Treatment: 67.2%
Δ = +5.8pp, p < .001, 95% CI [5.21pp, 6.39pp]

Subgroup Analysis:
Airport rides: lift +9.2pp (p < .001)
Surge pricing active: lift +3.1pp (p = .003)
New users (<30 days): lift +11.4pp (p < .001)

Revenue Impact (annualized estimate): +$23.4M
Infrastructure cost of v2.1: +$2.1M/year
Net ROI: ~10.1x`,
        parsedContent: `R MODEL OUTPUT:
A/B Test Results: Ride Completion Rate Optimization
Test Period: 90 days, N=124,832 users

Group Assignment:
Control (n=62,401): Standard dispatch algorithm
Treatment (n=62,431): ML-optimized dispatch v2.1

Primary Metric: Ride Completion Rate
Control:   73.2% (SE=0.18%)
Treatment: 78.6% (SE=0.17%)
Absolute lift: +5.4pp
Relative lift: +7.4%
Z-statistic: 21.4, p < .001, 95% CI [4.98pp, 5.82pp]

Secondary Metrics:
Driver ETA (minutes):
Control: 6.8 (SD=2.1), Treatment: 5.9 (SD=1.9)
Δ = -0.9 min, p < .001, 95% CI [-1.02, -0.78]

Cancellation Rate:
Control: 18.3%, Treatment: 14.1%
Δ = -4.2pp, p < .001, 95% CI [-4.71pp, -3.69pp]

Session-to-Ride Conversion:
Control: 61.4%, Treatment: 67.2%
Δ = +5.8pp, p < .001, 95% CI [5.21pp, 6.39pp]

Subgroup Analysis:
Airport rides: lift +9.2pp (p < .001)
Surge pricing active: lift +3.1pp (p = .003)
New users (<30 days): lift +11.4pp (p < .001)

Revenue Impact (annualized estimate): +$23.4M
Infrastructure cost of v2.1: +$2.1M/year
Net ROI: ~10.1x`,
      },
    ],
  },
]
