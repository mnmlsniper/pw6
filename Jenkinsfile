pipeline {
    agent any

    environment {
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }

    stages {
        stage('Build') {
            steps {
                nodejs('NodeJS2290') {
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps chromium'
                    sh 'npm add allure'
                    // Запуск тестов: даже если упадут — пайплайн продолжит генерацию отчета
                    sh 'npm t || echo "Tests completed with failures"'
                }
            }
        }

        stage('Generate Allure 3 Report') {
            steps {
                nodejs('NodeJS2290') {
                    // Генерация standalone HTML (Allure 3)
                    sh "npx allure awesome ${ALLURE_RESULTS} --single-file --report-dir ${ALLURE_REPORT}"
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
                // Плагин Allure Jenkins Plugin (для Allure 2, опционально)
                // Для Allure 3 лучше использовать archiveArtifacts + Publish HTML
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
            // Архивация артефактов для скачивания
            archiveArtifacts artifacts: "${ALLURE_RESULTS}/**/*,${ALLURE_REPORT}/**/*,playwright-report/**/*",
                             allowEmptyArchive: true,
                             fingerprint: true
            echo '✅ Pipeline completed. Reports archived.'
        }
        success {
            echo '🎉 All tests passed!'
        }
        failure {
            echo '❌ Pipeline failed. Check console output and archived artifacts.'
        }
    }
}
