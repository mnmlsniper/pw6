pipeline {
    agent any

    environment {
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }

    stages {
        stage('Build') {
            steps {
                nodejs('NodeJS22.22.0') {  // ← Изменили имя!
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps chromium'
                    sh 'npm add allure'
                    sh 'npm t || echo "Tests completed with failures"'
                }
            }
        }

        stage('Generate Allure 3 Report') {
            steps {
                nodejs('NodeJS22.22.0') {  // ← Изменили имя!
                    sh "npx allure awesome ${ALLURE_RESULTS} --single-file --report-dir ${ALLURE_REPORT}"
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
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
            archiveArtifacts artifacts: "${ALLURE_RESULTS}/**/*,${ALLURE_REPORT}/**/*,playwright-report/**/*",
                             allowEmptyArchive: true,
                             fingerprint: true
            echo '✅ Pipeline completed. Reports archived.'
        }
        failure {
            echo '❌ Pipeline failed. Check console output.'
        }
    }
}
