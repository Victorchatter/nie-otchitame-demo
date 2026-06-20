// Jenkins declarative pipeline for ПРОЕКТ-ДЖОБС / Nie Otchitame
// Requires: Docker, docker-compose or buildx, Python, Node, Playwright deps on agent

pipeline {
    agent any

    environment {
        PYTHON_VERSION = '3.12'
        NODE_VERSION = '20'
        REGISTRY = credentials('container-registry-url')   // e.g. registry.example.com
        BACKEND_IMAGE = "${env.REGISTRY}/nie-otchitame-backend"
        FRONTEND_IMAGE = "${env.REGISTRY}/nie-otchitame-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Lint') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            sh 'python -m pip install --upgrade pip'
                            sh 'pip install -r requirements.txt ruff'
                            sh 'ruff check .'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Pytest') {
                    steps {
                        dir('backend') {
                            sh 'pip install -r requirements-dev.txt'
                            sh 'pytest tests/ -v --cov=app --cov-report=xml --cov-report=term'
                        }
                    }
                    post {
                        always {
                            junit 'backend/junit.xml'
                        }
                    }
                }
                stage('Frontend Playwright') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npx playwright install --with-deps'
                            sh 'npm run test:e2e'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh "docker build -t ${env.BACKEND_IMAGE}:${env.IMAGE_TAG} -t ${env.BACKEND_IMAGE}:latest ./backend"
                    sh "docker build -t ${env.FRONTEND_IMAGE}:${env.IMAGE_TAG} -t ${env.FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${env.REGISTRY}", 'registry-credentials-id') {
                        sh "docker push ${env.BACKEND_IMAGE}:${env.IMAGE_TAG}"
                        sh "docker push ${env.BACKEND_IMAGE}:latest"
                        sh "docker push ${env.FRONTEND_IMAGE}:${env.IMAGE_TAG}"
                        sh "docker push ${env.FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed — check stage logs above.'
        }
    }
}
