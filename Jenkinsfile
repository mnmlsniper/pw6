pipeline {
    agent any

    environment {
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }

    stages {
        stage('Build') {
            steps {
                nodejs('NodeJS22.22.0') {
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps chromium'
                    sh 'npm add allure'
                    // Запускаем тесты: ошибки не ломают пайплайн
                    sh 'npm t || echo "Tests completed with failures"'
                }
            }
        }

        stage('Generate Allure 3 Report') {
            steps {
                nodejs('NodeJS22.22.0') {
                    // ✅ Исправлено: -o вместо --report-dir
                    // --single-file создаст один HTML-файл
                    catchError(buildFail: false, stageResult: 'UNSTABLE') {
                        sh "npx allure awesome ${ALLURE_RESULTS} --single-file -o ${ALLURE_REPORT}/report.html"
                    }
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
                // Allure Plugin (для Allure 2, опционально)
                allure(
                    [
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: "${ALLURE_RESULTS}"]]
                    ]
                )
            }
        }
    }

    post {
        always {
            // Архивируем всё: результаты, отчёт, скриншоты
            archiveArtifacts artifacts: "${ALLURE_RESULTS}/**/*,${ALLURE_REPORT}/**/*,playwright-report/**/*,test-results/**/*",
                             allowEmptyArchive: true,
                             fingerprint: true
            echo '✅ Pipeline completed. Reports archived.'
        }
        failure {
            echo '❌ Pipeline failed. Check console output.'
        }
    }
}
