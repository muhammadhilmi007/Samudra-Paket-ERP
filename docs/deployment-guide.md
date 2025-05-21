# Samudra Paket ERP Deployment Guide

This document provides instructions for deploying the Samudra Paket ERP application to Railway.com.

## Prerequisites

- Railway.com account with appropriate permissions
- Railway CLI installed locally
- GitHub repository connected to Railway.com
- Environment variables configured in Railway.com

## Deployment Process

### Manual Deployment

1. **Login to Railway CLI**

   ```bash
   railway login
   ```

2. **Link the project**

   ```bash
   railway link
   ```

3. **Deploy the application**

   ```bash
   railway up
   ```

### Automated Deployment via GitHub Actions

The application is configured to automatically deploy to Railway.com when changes are pushed to the `main` or `development` branches. The CI/CD pipeline will:

1. Run linting checks
2. Execute tests
3. Build the application
4. Deploy to Railway.com (production for `main` branch, development for `development` branch)

## Environment Variables

The following environment variables need to be configured in Railway.com:

### Web Application

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_API_URL` | API Gateway URL | `https://api.samudrapaket.com` |
| `NEXT_PUBLIC_APP_URL` | Web application URL | `https://app.samudrapaket.com` |

### API Gateway

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Port to run the service | `3000` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `1d` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | `your-refresh-secret` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins | `https://app.samudrapaket.com` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `REDIS_URL` | Redis connection string | `redis://...` |

## Monitoring and Logs

- Access logs via Railway.com dashboard
- Monitor application health via the `/api/health` endpoint
- Set up alerts for service disruptions

## Rollback Procedure

If a deployment fails or causes issues:

1. Navigate to the Railway.com dashboard
2. Select the service with issues
3. Click on "Deployments" tab
4. Find the last working deployment
5. Click "Rollback to this deployment"

## Security Considerations

- Ensure all secrets are stored as Railway.com variables, not in code
- Rotate JWT secrets periodically
- Enable Railway.com's DDoS protection
- Configure proper CORS settings

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs for errors
   - Verify dependencies are correctly specified
   - Ensure environment variables are properly configured

2. **Runtime Errors**
   - Check application logs
   - Verify service connections (MongoDB, Redis)
   - Check for memory or CPU constraints

3. **Networking Issues**
   - Verify domain configuration
   - Check CORS settings
   - Ensure services can communicate with each other

## Contact

For deployment issues, contact the DevOps team at devops@samudrapaket.com.
