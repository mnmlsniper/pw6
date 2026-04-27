pipeline {
    agent any

    environment {
        // Пути для артефактов и отчётов
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
        PLAYWRIGHT_REPORT = 'playwright-report'
        // Опционально: настройки локализации для браузеров
        LANG = 'en_US.UTF-8'
        LANGUAGE = 'en_US:en'
        LC_ALL = 'en_US.UTF-8'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                // Используем плагин NodeJS или устанавливаем вручную
                // Требуется плагин "NodeJS Plugin" в Jenkins
                nodejs('NodeJS2290') { 
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs('node-18') {
                    // Аналог npm ci из вашего workflow
                    sh 'npm ci'
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                nodejs('node-18') {
                    // Установка браузеров и системных зависимостей (аналог --with-deps)
                    sh 'npx playwright install --with-deps'
                }
            }
        }

        stage('Install Allure 3') {
            steps {
                nodejs('node-18') {
                    // Установка allure, как в вашем CI
                    sh 'npm add allure'
                }
            }
        }

        stage('Run Tests') {
            steps {
                nodejs('node-18') {
                    // Запуск тестов. 
                    // Важно: убедитесь, что playwright.config.js настроен на генерацию результатов в allure-results
                    sh 'npm t'
                }
            }
            post {
                // Сбор артефактов даже если тесты упали
                always {
                    archiveArtifacts artifacts: "${ALLURE_RESULTS}/**/*,${PLAYWRIGHT_REPORT}/**/*", 
                                     allowEmptyArchive: true,
                                     fingerprint: true
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                nodejs('node-18') {
                    // Генерация отчета в один файл (как в вашем workflow: allure awesome)
                    // continue-on-error аналог: catchError(buildFail: false)
                    catchError(buildFail: false, stageResult: 'UNSTABLE') {
                        sh "npx allure awesome ${ALLURE_RESULTS} --single-file"
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Архивация готового отчета и исходных данных
                archiveArtifacts artifacts: "${ALLURE_REPORT}/**/*,${ALLURE_RESULTS}/**/*,${PLAYWRIGHT_REPORT}/**/*",
                                 allowEmptyArchive: true,
                                 fingerprint: true
            }
        }
    }

    post {
        always {
            // Очистка воркспейса, если нужно (опционально)
            // cleanWs()
            
            // Публикация результатов в Jenkins (нативный плагин)
            // Требуется плагин "Allure Jenkins Plugin"
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: "${ALLURE_RESULTS}"]]
            ])
        }
        failure {
            echo '❌ Pipeline failed. Check test logs and Playwright report.'
        }
        success {
            echo '✅ All tests passed. Allure report generated.'
        }
    }
}
