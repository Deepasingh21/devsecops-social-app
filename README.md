# DevSecOps Social App

A production-style full-stack social media application deployed on AWS EC2 with Docker, GitHub Actions CI/CD, security scanning, centralized monitoring, alerting, HTTPS, and AWS SSM-based deployment.

---

## 🚀 Project Overview

This project demonstrates a complete DevSecOps implementation for a full-stack web application.

The application consists of:

- React + Vite frontend
- Node.js + Express backend
- MongoDB database
- Docker containerization
- Nginx reverse proxy
- HTTPS with Let's Encrypt
- GitHub Actions CI/CD
- GitHub OIDC authentication
- AWS Systems Manager (SSM) deployment
- Trivy vulnerability scanning
- GitHub CodeQL analysis
- Prometheus monitoring
- Node Exporter
- Grafana dashboards
- Alertmanager email alerts

---

## 🏗️ Architecture

```text
                         Internet
                            |
                            | HTTPS 443
                            v
                    +----------------+
                    |  AWS EC2       |
                    | Ubuntu 24.04   |
                    +-------+--------+
                            |
                         Nginx
                            |
                     +------+------+
                     |             |
                     v             v
                Frontend       Backend
                React/Vite     Node.js
                Nginx          Express
                     |             |
                     |             |
                     +------v------+
                         MongoDB
                           
                    Monitoring Stack
              +----------+----------+
              |          |          |
          Prometheus   Grafana   Alertmanager
              |
        Node Exporter


GitHub
   |
   | OIDC
   v
AWS IAM Role
   |
   | SSM
   v
AWS EC2
   |
   v
Docker Compose
