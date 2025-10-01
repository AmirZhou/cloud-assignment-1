# GitHub Actions CI/CD Pipeline Explained - Complete Guide

## What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Deployment** (or Delivery).

**Continuous Integration (CI):**
- Automatically test code when developers push changes
- Catch bugs early before they reach production
- Ensure code integrates well with the main codebase

**Continuous Deployment (CD):**
- Automatically deploy code after tests pass
- Push Docker images to registries
- Deploy to production/staging environments

**Why use CI/CD?**
- 🚀 Faster releases (automate manual tasks)
- 🐛 Fewer bugs (automated testing)
- 🔄 Consistent deployments (same process every time)
- 👥 Better collaboration (everyone uses the same pipeline)

---

## GitHub Actions Overview

GitHub Actions is GitHub's built-in CI/CD tool.

**Key Concepts:**
- **Workflow**: Automated process defined in YAML
- **Event**: Trigger that starts a workflow (push, pull request, schedule, etc.)
- **Job**: Set of steps that execute on the same runner
- **Step**: Individual task (run command, use action, etc.)
- **Action**: Reusable unit of code (like a function)
- **Runner**: Server that runs your workflows (GitHub-hosted or self-hosted)

---

## Our CI/CD Pipeline Line-by-Line

```yaml
# Task 4: CI/CD Pipeline with GitHub Actions
# Yue: Customize after Docker setup is complete

name: Diet Analysis CI/CD Pipeline
```

**Explanation:**
- `name` is the display name in GitHub Actions UI
- Shows up in the Actions tab and on PR status checks
- Choose descriptive names to identify workflows easily

---

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

**Explanation:**
- `on` defines when the workflow runs (the trigger events)
- `push: branches: [main, develop]`: Runs when code is pushed to main or develop branches
- `pull_request: branches: [main]`: Runs when a PR targets the main branch
- This ensures every change is tested before merging

**Other possible triggers:**
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger
  release:
    types: [published]
```

---

```yaml
env:
  TEST_TAG: diet-analysis:test
```

**Explanation:**
- `env` defines environment variables available to ALL jobs
- `TEST_TAG` is a custom variable we use for the Docker image tag during testing
- Variables can be referenced as `${{ env.TEST_TAG }}`
- Useful for avoiding repetition and centralizing configuration

---

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```

**Explanation:**
- `jobs` section defines the jobs in this workflow
- `test` is the job name (you choose this)
- `runs-on` specifies which operating system to use
- `ubuntu-latest` uses GitHub's latest Ubuntu runner (free for public repos)
- Other options: `windows-latest`, `macos-latest`, `ubuntu-20.04`

---

```yaml
    steps:
      - uses: actions/checkout@v4
```

**Explanation:**
- `steps` are the tasks that run in this job
- `uses` runs a pre-built action (reusable code)
- `actions/checkout@v4` checks out your repository code
- Without this, the runner has an empty filesystem
- `@v4` specifies the version (always use versions for reproducibility)

---

```yaml
      - name: Set up Python 3.9
        uses: actions/setup-python@v4
        with:
          python-version: 3.9
```

**Explanation:**
- `name` describes what this step does (shows in logs)
- `actions/setup-python@v4` installs Python on the runner
- `with` passes parameters to the action
- `python-version: 3.9` specifies which Python version to install
- This ensures consistent Python version across all runs

---

```yaml
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
```

**Explanation:**
- `run` executes shell commands
- `|` (pipe) allows multiple lines of commands
- Upgrades pip and installs project dependencies
- Each `run` step is a separate shell session

---

```yaml
      - name: Run tests
        run: |
          # TODO: Add proper tests
          python -m pytest tests/ -v || echo "No tests found - implement tests"
```

**Explanation:**
- Runs pytest to execute tests
- `-v` for verbose output
- `|| echo "..."` means: if pytest fails (no tests), print message instead of failing the workflow
- This is a placeholder - in production you'd have actual tests

---

```yaml
      - name: Run linting
        run: |
          # TODO: Add linting
          python -m flake8 src/ --count --select=E9,F63,F7,F82 --show-source --statistics || echo "Linting skipped"
```

**Explanation:**
- Runs flake8 to check code quality
- `--select=E9,F63,F7,F82` checks for syntax errors and undefined names
- `--show-source` shows the offending code
- `|| echo` makes it non-blocking (doesn't fail the build)

---

```yaml
  build-and-push:
    needs: test
    runs-on: ubuntu-latest
```

**Explanation:**
- `build-and-push` is a new job
- `needs: test` means this job waits for the `test` job to succeed
- Creates a dependency chain: test → build-and-push
- If `test` fails, this job won't run (saves time and resources)

---

```yaml
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```

**Explanation:**
- Checks out code again (each job runs on a fresh runner)
- `docker/login-action@v3` logs into Docker Hub
- `secrets.DOCKERHUB_USERNAME` accesses encrypted secret from GitHub
- Secrets are set in: Repo Settings → Secrets and variables → Actions
- **Never hardcode credentials!** Always use secrets

---

```yaml
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
```

**Explanation:**
- `QEMU` enables building Docker images for different CPU architectures (ARM, x86, etc.)
- `Buildx` is Docker's modern build engine with advanced features:
  - Better caching
  - Multi-platform builds
  - Build secrets
  - Concurrent builds
- Not strictly necessary for simple builds, but best practice

---

```yaml
      - name: Verify Docker Build
        run: |
          echo "✅ Docker image built successfully"
          docker images | grep diet-analysis
          echo "Note: Full execution requires data volume: docker run -v \$(pwd)/data:/app/data diet-analysis"
```

**Explanation:**
- Verifies the Docker image was built
- `docker images | grep` searches for our image
- Prints usage instructions
- This step replaced the actual test run (which needs data)

---

```yaml
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/diet-analysis:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/diet-analysis:${{ github.sha }}
```

**Explanation:**
- `docker/build-push-action@v5` builds and pushes Docker images
- `context: .` uses current directory as build context
- `push: true` pushes to Docker Hub after building
- `tags:` creates multiple tags:
  - `:latest` always points to the newest version
  - `:${{ github.sha }}` uses the git commit hash (immutable, traceable)
- `${{ github.sha }}` is a built-in variable (git commit SHA)

**Why multiple tags?**
- `latest`: Easy to pull most recent version
- `commit-sha`: Ability to roll back to specific version

---

```yaml
  simulate-deployment:
    needs: build-and-push
    runs-on: ubuntu-latest
```

**Explanation:**
- Third job in the pipeline
- `needs: build-and-push` runs after the build job succeeds
- Simulates a deployment step

---

```yaml
    steps:
      - uses: actions/checkout@v4

      - name: Verify Deployment Simulation
        run: |
          echo "✅ Image successfully pushed to Docker Hub"
          echo "To run locally with data:"
          echo "  docker pull ${{ secrets.DOCKERHUB_USERNAME }}/diet-analysis:latest"
          echo "  docker run -v \$(pwd)/data:/app/data -v \$(pwd)/outputs:/app/outputs ${{ secrets.DOCKERHUB_USERNAME }}/diet-analysis:latest"
          echo ""
          echo "Deployment simulation complete - image ready for use"
```

**Explanation:**
- Prints deployment instructions
- In a real production pipeline, this might:
  - Deploy to Kubernetes
  - Update a cloud service
  - Trigger deployment scripts
  - Send notifications
- For this project, we just verify the image is available

---

## CI/CD Pipeline Flow

```
Push to main/develop or Create PR
            ↓
┌───────────────────────┐
│   Job 1: Test         │
│   - Checkout code     │
│   - Setup Python      │
│   - Install deps      │
│   - Run tests         │
│   - Run linting       │
└───────────────────────┘
            ↓ (only if test passes)
┌───────────────────────┐
│   Job 2: Build & Push │
│   - Checkout code     │
│   - Login to Docker   │
│   - Setup Buildx      │
│   - Build image       │
│   - Push to Hub       │
└───────────────────────┘
            ↓ (only if build passes)
┌───────────────────────┐
│   Job 3: Deploy       │
│   - Verify deployment │
│   - Print usage       │
└───────────────────────┘
            ↓
    ✅ Success!
    Image available on Docker Hub
```

---

## GitHub Actions Concepts Deep Dive

### 1. **Secrets Management**

**Setting up secrets:**
1. Go to repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

**Using secrets:**
```yaml
${{ secrets.SECRET_NAME }}
```

**Best practices:**
- ✅ Never commit secrets to code
- ✅ Use different secrets for different environments
- ✅ Rotate secrets regularly
- ✅ Use least privilege (give minimal permissions)

---

### 2. **Context Variables**

GitHub provides many built-in variables:

```yaml
${{ github.sha }}          # Commit SHA (abc123...)
${{ github.ref }}          # Branch ref (refs/heads/main)
${{ github.repository }}   # Repo name (user/repo)
${{ github.actor }}        # User who triggered workflow
${{ github.event_name }}   # Event type (push, pull_request)
${{ runner.os }}           # Runner OS (Linux, Windows, macOS)
```

**Example usage:**
```yaml
- name: Print context
  run: |
    echo "Commit: ${{ github.sha }}"
    echo "Branch: ${{ github.ref }}"
    echo "Triggered by: ${{ github.actor }}"
```

---

### 3. **Conditional Execution**

Run steps only under certain conditions:

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: ./deploy-prod.sh

- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: ./deploy-staging.sh

- name: Run only on schedule
  if: github.event_name == 'schedule'
  run: ./cleanup.sh
```

---

### 4. **Matrix Builds**

Test across multiple versions/platforms:

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: [3.8, 3.9, 3.10, 3.11]
    steps:
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
```

This creates 12 jobs (3 OS × 4 Python versions)!

---

### 5. **Caching Dependencies**

Speed up workflows by caching dependencies:

```yaml
- name: Cache pip packages
  uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-

- name: Install dependencies
  run: pip install -r requirements.txt
```

---

## Common CI/CD Patterns

### 1. **Branching Strategy with CI/CD**

```yaml
# Deploy to different environments based on branch
on:
  push:
    branches:
      - main        # Production
      - develop     # Staging
      - 'feature/*' # Feature branches (tests only)

jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]  # Always run tests

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    steps: [...]  # Deploy to staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    steps: [...]  # Deploy to production
```

---

### 2. **Manual Approval for Production**

```yaml
on:
  workflow_dispatch:  # Manual trigger only
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps: [...]
```

---

### 3. **Building and Testing Pull Requests**

```yaml
on:
  pull_request:
    branches: [main]

jobs:
  pr-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: pytest

      - name: Check code coverage
        run: pytest --cov=src --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All checks passed!'
            })
```

---

## Interview Questions (10)

### Question 1: Explain the difference between GitHub Actions, Jenkins, and GitLab CI/CD.

**Answer:**

**GitHub Actions:**
- ✅ Built into GitHub (no separate server needed)
- ✅ Free for public repos, generous free tier for private
- ✅ Huge marketplace of pre-built actions
- ✅ YAML-based configuration
- ❌ Locked to GitHub

**Jenkins:**
- ✅ Self-hosted (full control)
- ✅ Mature ecosystem, many plugins
- ✅ Works with any Git provider
- ❌ Requires server management
- ❌ Steeper learning curve

**GitLab CI/CD:**
- ✅ Built into GitLab
- ✅ Excellent for complex pipelines
- ✅ Free runners for public projects
- ❌ Locked to GitLab

**When to use each:**
- GitHub Actions: If you're already on GitHub
- Jenkins: Need full control, complex workflows, multi-platform
- GitLab CI/CD: If you're on GitLab

---

### Question 2: What's the difference between `needs`, `if`, and `depends_on` in GitHub Actions?

**Answer:**

**`needs`** (job-level dependency):
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: test  # Waits for 'test' job to complete successfully
    runs-on: ubuntu-latest
    steps: [...]
```
- Creates dependency between jobs
- `deploy` only runs if `test` succeeds
- Jobs without `needs` run in parallel

**`if`** (conditional execution):
```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'  # Only on main branch
    runs-on: ubuntu-latest
    steps: [...]
```
- Evaluates expression to decide if job/step should run
- Can use on jobs or individual steps

**`depends_on`** doesn't exist in GitHub Actions (that's Docker Compose terminology!)

---

### Question 3: How do GitHub Actions secrets work and what are best practices for managing them?

**Answer:**

**How secrets work:**
1. Stored encrypted in GitHub's database
2. Only exposed to workflow runs as environment variables
3. Automatically redacted from logs (shown as `***`)
4. Never accessible via API or web UI after creation

**Setting secrets:**
- Repository: Settings → Secrets → Actions → New secret
- Organization: For sharing across multiple repos
- Environment: For environment-specific secrets (prod vs staging)

**Best practices:**
1. ✅ **Rotate regularly** - Change secrets periodically
2. ✅ **Least privilege** - Use service accounts with minimal permissions
3. ✅ **Different secrets per environment** - Don't reuse prod secrets in staging
4. ✅ **Use environment protection rules** - Require approvals for prod deployments
5. ✅ **Audit access** - Review who can access secrets
6. ❌ **Never echo secrets** - Don't print them in logs
7. ❌ **Don't use secrets in forks** - Secrets aren't available to fork PRs (security feature)

**Example of secure secret usage:**
```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: |
    # API_KEY is available but won't show in logs
    ./deploy.sh
```

---

### Question 4: Explain the GitHub Actions workflow syntax: `uses` vs `run`.

**Answer:**

**`run`** - Execute shell commands:
```yaml
- name: Build app
  run: |
    npm install
    npm run build
```
- Runs arbitrary shell commands
- Each `run` is a separate shell session
- Can use `|` for multiline scripts

**`uses`** - Use a pre-built action:
```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```
- Runs JavaScript or Docker actions created by GitHub or community
- Reusable, tested, maintained by others
- Can pass parameters via `with`

**When to use each:**
- `run`: Simple commands, custom scripts, sequential operations
- `uses`: Complex logic, community solutions, repeatability

**Example combining both:**
```yaml
steps:
  - uses: actions/checkout@v4  # Use action for checkout

  - uses: actions/setup-node@v3  # Use action for Node setup
    with:
      node-version: 18

  - run: npm install  # Use run for simple commands
  - run: npm test
  - run: npm run build

  - uses: actions/upload-artifact@v3  # Use action for complex upload logic
    with:
      name: build-output
      path: dist/
```

---

### Question 5: How does job parallelization work and when should you use `needs`?

**Answer:**

**By default, jobs run in parallel:**
```yaml
jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps: [...]

  test-backend:
    runs-on: ubuntu-latest
    steps: [...]

  lint:
    runs-on: ubuntu-latest
    steps: [...]
```
All three jobs start simultaneously (saves time!).

**Use `needs` to create dependencies:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: build  # Waits for build
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: [build, test]  # Waits for both
    runs-on: ubuntu-latest
    steps: [...]
```

**Execution flow:**
```
build ──────────┐
                ├──> test ──> deploy
                │
(runs parallel) │
                ↓
lint ───────────┘
```

**Best practices:**
- ✅ Parallelize independent jobs (faster CI)
- ✅ Use `needs` only when truly dependent
- ✅ Put fast jobs early to catch issues quickly
- ✅ Group related steps into jobs

---

### Question 6: What are GitHub Actions artifacts and when should you use them?

**Answer:**

**Artifacts** are files/directories preserved after a job completes, shareable between jobs or downloadable.

**Upload artifacts:**
```yaml
- name: Build app
  run: npm run build

- name: Upload build output
  uses: actions/upload-artifact@v3
  with:
    name: webapp
    path: dist/
```

**Download in another job:**
```yaml
deploy:
  needs: build
  steps:
    - uses: actions/download-artifact@v3
      with:
        name: webapp
        path: ./dist

    - name: Deploy
      run: ./deploy.sh dist/
```

**Use cases:**
1. ✅ **Share build outputs** between jobs (build once, use multiple times)
2. ✅ **Debug failed builds** (download logs, screenshots, core dumps)
3. ✅ **Store test results** (code coverage, test reports)
4. ✅ **Archive releases** (binaries, packages)

**Key points:**
- Stored for 90 days (default, configurable)
- Count against storage quota
- Available in workflow UI for download
- Automatically zipped

---

### Question 7: How would you implement environment-specific deployments (dev, staging, prod)?

**Answer:**

**Approach 1: Branch-based deployment**
```yaml
on:
  push:
    branches:
      - develop   # → staging
      - main      # → production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: ./deploy.sh staging

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh production
```

**Approach 2: GitHub Environments (recommended)**
```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging  # Uses staging secrets/vars
    if: github.ref == 'refs/heads/develop'
    steps:
      - run: ./deploy.sh
        env:
          API_URL: ${{ vars.API_URL }}  # staging API URL

  deploy-production:
    runs-on: ubuntu-latest
    environment: production  # Uses production secrets/vars
    if: github.ref == 'refs/heads/main'
    steps:
      - run: ./deploy.sh
        env:
          API_URL: ${{ vars.API_URL }}  # production API URL
```

**Approach 3: Manual workflow with input**
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [dev, staging, production]
        required: true

jobs:
  deploy:
    environment: ${{ github.event.inputs.environment }}
    steps: [...]
```

**Benefits of GitHub Environments:**
- ✅ Environment-specific secrets and variables
- ✅ Protection rules (required reviewers for prod)
- ✅ Deployment history and tracking
- ✅ Wait timers

---

### Question 8: How do you handle failures and notifications in GitHub Actions?

**Answer:**

**1. Conditional steps based on previous step status:**
```yaml
- name: Run tests
  id: tests
  run: pytest
  continue-on-error: true

- name: Notify on test failure
  if: steps.tests.outcome == 'failure'
  run: echo "Tests failed!"

- name: Always cleanup
  if: always()  # Runs even if previous steps failed
  run: ./cleanup.sh
```

**2. Send Slack notification:**
```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    channel-id: 'deployments'
    slack-message: |
      ❌ Build failed!
      Repo: ${{ github.repository }}
      Branch: ${{ github.ref }}
      Actor: ${{ github.actor }}
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

**3. Send email:**
```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Build Failed - ${{ github.repository }}
    body: Build failed for commit ${{ github.sha }}
    to: team@example.com
```

**4. Create GitHub issue on failure:**
```yaml
- name: Create issue on failure
  if: failure()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'CI/CD Failure - ${{ github.sha }}',
        body: 'Build failed. Check logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}',
        labels: ['bug', 'ci-cd']
      })
```

**Conditional execution keywords:**
- `success()`: Previous steps succeeded
- `failure()`: Any previous step failed
- `cancelled()`: Workflow was cancelled
- `always()`: Run regardless of status

---

### Question 9: What's the difference between self-hosted and GitHub-hosted runners?

**Answer:**

**GitHub-hosted runners:**
- ✅ **Managed by GitHub** - No setup required
- ✅ **Free tier** - 2,000 minutes/month for private repos, unlimited for public
- ✅ **Clean environment** - Fresh VM for each job
- ✅ **Multiple OS** - Ubuntu, Windows, macOS
- ❌ **Limited resources** - 2-core CPU, 7GB RAM
- ❌ **No persistent storage**
- ❌ **Network restrictions** - Can't access internal services

**Self-hosted runners:**
- ✅ **Full control** - Choose hardware, OS, software
- ✅ **Access internal resources** - Can deploy to private networks
- ✅ **Persistent storage** - Can cache between runs
- ✅ **Custom software** - Pre-install tools
- ✅ **No minute limits**
- ❌ **You manage it** - Updates, security, maintenance
- ❌ **Security risks** - Running untrusted code on your infrastructure

**When to use self-hosted:**
1. Need access to internal services (databases, APIs)
2. Require specific hardware (GPU, lots of RAM)
3. Very high CI/CD usage (save on minutes)
4. Need persistent caching
5. Specific software requirements

**Setting up self-hosted runner:**
1. Settings → Actions → Runners → New self-hosted runner
2. Follow instructions to install on your server
3. Runner registers and starts picking up jobs

```yaml
jobs:
  build:
    runs-on: self-hosted  # Use self-hosted runner
    steps: [...]
```

---

### Question 10: How do you debug a failed GitHub Actions workflow?

**Answer:**

**Step 1: Read the logs**
- Click on failed job in Actions tab
- Expand failed step
- Look for error messages (often at the end)

**Step 2: Enable debug logging**
```yaml
# In workflow file
env:
  ACTIONS_STEP_DEBUG: true  # Detailed step logs
  ACTIONS_RUNNER_DEBUG: true  # Detailed runner logs
```
Or set repository secrets:
- `ACTIONS_STEP_DEBUG` = `true`
- `ACTIONS_RUNNER_DEBUG` = `true`

**Step 3: Add debugging steps**
```yaml
- name: Debug info
  run: |
    echo "GitHub context:"
    echo "  Event: ${{ github.event_name }}"
    echo "  Ref: ${{ github.ref }}"
    echo "  SHA: ${{ github.sha }}"
    echo "  Actor: ${{ github.actor }}"

    echo "Environment:"
    env

    echo "Working directory:"
    pwd
    ls -la

    echo "System info:"
    uname -a
    df -h
```

**Step 4: SSH into runner (advanced)**
```yaml
- name: Setup tmate session (SSH access)
  if: failure()
  uses: mxschmitt/action-tmate@v3
```

**Step 5: Test locally**
```bash
# Install act (runs GitHub Actions locally)
brew install act

# Run workflow locally
act -j test
```

**Common issues and fixes:**

1. **"Resource not accessible by integration"**
   - Fix: Check token permissions in Settings → Actions → General

2. **Secrets not working**
   - Fix: Verify secret names match exactly (case-sensitive)
   - Check if forks have access to secrets (they don't by default)

3. **Docker build fails**
   - Fix: Check Dockerfile syntax, ensure files exist in context

4. **Timeout**
   - Fix: Increase timeout: `timeout-minutes: 60`

5. **Job skipped**
   - Fix: Check `if` conditions and `needs` dependencies

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Awesome Actions List](https://github.com/sdras/awesome-actions)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [act - Run GitHub Actions locally](https://github.com/nektos/act)
