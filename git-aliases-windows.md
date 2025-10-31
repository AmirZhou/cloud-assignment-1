# Git Aliases Setup for Windows

This document contains all the git aliases from your macOS setup, adapted for Windows. Use this to migrate your git configuration to a Windows machine.

## Quick Setup (Windows)

### Option 1: Using Git Bash / PowerShell (Recommended)

Open **Git Bash** or **PowerShell** and run each command below:

```bash
# Basic aliases
git config --global alias.st "status -sb"
git config --global alias.ci "commit"
git config --global alias.l "log --oneline"
git config --global alias.a "add ."
git config --global alias.d "diff"
git config --global alias.unstage "reset HEAD --"
git config --global alias.bra "branch -a"
git config --global alias.sw "switch"
git config --global alias.gbrv "branch -r -v"
git config --global alias.fa "fetch --all"
```

### Option 2: Edit `.gitconfig` Directly (Windows)

1. Open your `.gitconfig` file located at: `C:\Users\YourUsername\.gitconfig`
2. Add the `[alias]` section from below
3. Save the file

---

## All Aliases Reference

### Basic Commands

#### `git st` - Colorful Status (Short & Branch)
**What it does:** Shows a concise, colorful status with branch info
```bash
git config --global alias.st "status -sb"
```

#### `git ci` - Commit
**What it does:** Shortcut for commit
```bash
git config --global alias.ci "commit"
```

#### `git l` - Log Oneline
**What it does:** Shows commit history in one line per commit
```bash
git config --global alias.l "log --oneline"
```

#### `git lg` - Beautiful Log Graph
**What it does:** Shows a colorful, formatted commit graph with dates and authors
```bash
git config --global alias.lg "log --graph --abbrev-commit --decorate --format=format:\"%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)\""
```

#### `git a` - Add All
**What it does:** Stages all changes
```bash
git config --global alias.a "add ."
```

#### `git d` - Diff
**What it does:** Shows differences
```bash
git config --global alias.d "diff"
```

#### `git unstage` - Unstage Files
**What it does:** Removes files from staging area
```bash
git config --global alias.unstage "reset HEAD --"
```

---

### Branch Management

#### `git bra` - List All Branches
**What it does:** Shows all local and remote branches
```bash
git config --global alias.bra "branch -a"
```

#### `git gbrv` - Remote Branches Verbose
**What it does:** Lists remote branches with additional info
```bash
git config --global alias.gbrv "branch -r -v"
```

#### `git sw` - Switch Branch
**What it does:** Shortcut for switching branches
```bash
git config --global alias.sw "switch"
```

#### `git swc` - Switch and Create Branch (Advanced)
**What it does:** Creates a new branch from a remote branch with validation and colorful output

**Windows (Git Bash):**
```bash
git config --global alias.swc '!f() { echo "\033[1;34m📖 Usage:\033[0m git swc <new-branch-name> <remote>/<base-branch>"; echo "\033[1;90m   Example: git swc feature/new-ui origin/main\033[0m"; echo ""; if [ -z "$1" ] || [ -z "$2" ]; then echo "\033[1;31m❌ Error:\033[0m Missing arguments."; return 1; fi; remote=$(echo "$2" | cut -d/ -f1); base_branch=$(echo "$2" | cut -d/ -f2-); if git show-ref --verify --quiet refs/heads/"$1"; then echo "\033[1;31m❌ Error:\033[0m Branch already exists locally."; return 1; fi; echo "🚀 \033[1;36mStarting robust branch creation...\033[0m"; echo "🔄 Fetching latest updates from \033[1;33m$remote\033[0m..."; if git fetch "$remote" >/dev/null 2>&1; then if git show-ref --verify --quiet refs/remotes/"$2"; then echo "✨ Creating and switching to branch \033[1;33m$1\033[0m from \033[1;33m$2\033[0m"; git switch -c "$1" "$2"; echo "✅ \033[1;32mDone! You are now on branch. Happy coding!\033[0m"; else echo "\033[1;31m❌ Error:\033[0m Remote branch does not exist."; return 1; fi; else echo "\033[1;31m❌ Fetch failed. Aborting branch creation.\033[0m"; return 1; fi; }; f'
```

**Windows (PowerShell):** *Note: ANSI colors may not work in PowerShell. Use Git Bash for best experience.*

**Usage:**
```bash
git swc feature/new-feature origin/main
```

---

### Fetch Operations

#### `git fa` - Fetch All
**What it does:** Fetches from all remotes
```bash
git config --global alias.fa "fetch --all"
```

---

### Rebase Operations

#### `git rb` - Rebase onto Branch (default: dev)
**What it does:** Fetches and rebases current branch onto target branch with status emojis

**Windows (Git Bash):**
```bash
git config --global alias.rb '!f() { target=${1:-dev}; echo "🚀 Fetching latest changes from origin..."; git fetch origin && echo "🔄 Rebasing $(git branch --show-current) onto origin/$target..."; git rebase origin/$target && echo "✅ Successfully rebased onto origin/$target!"; }; f'
```

**Usage:**
```bash
git rb          # Rebases onto origin/dev
git rb main     # Rebases onto origin/main
```

#### `git rbi` - Interactive Rebase
**What it does:** Starts interactive rebase onto specified branch (default: dev)

**Windows (Git Bash):**
```bash
git config --global alias.rbi '!f() { git fetch origin && git rebase -i origin/${1:-dev}; }; f'
```

#### `git rbs` - Rebase with Stash
**What it does:** Stashes changes, rebases, then pops stash

**Windows (Git Bash):**
```bash
git config --global alias.rbs '!f() { git stash push -m "auto-stash for rebase" && git fetch origin && git rebase origin/${1:-dev} && git stash pop; }; f'
```

#### `git rbonto` - Rebase Onto (Advanced)
**What it does:** Rebases current branch onto a new base, removing old base commits

**Windows (Git Bash):**
```bash
git config --global alias.rbonto '!f() { git fetch origin && git rebase --onto origin/$1 origin/$2 HEAD; }; f'
```

**Usage:**
```bash
git rbonto main dev  # Moves commits from dev to main
```

#### `git rbabort` - Abort Rebase
**What it does:** Aborts current rebase with friendly message

**Windows (Git Bash):**
```bash
git config --global alias.rbabort '!git rebase --abort && echo "🔥 Rebase aborted - back to safety!"'
```

#### `git rbcont` - Continue Rebase
**What it does:** Stages all changes and continues rebase

**Windows (Git Bash):**
```bash
git config --global alias.rbcont '!git add . && git rebase --continue && echo "✅ Rebase continued!"'
```

---

### Advanced Workflow

#### `git grab` - Grab Remote Branch
**What it does:** Fetches a remote branch, creates local branch, and stashes/restores local changes automatically

**Windows (Git Bash):**
```bash
git config --global alias.grab '!f() { remote_branch=$1; local_branch=${remote_branch#*/}; echo "\033[1;36m🌐 Fetching remote branch:\033[0m $remote_branch"; git fetch ${remote_branch%%/*} ${remote_branch#*/}; if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ] || git ls-files -u | grep -q .; then echo "\033[1;31m❌ Cannot grab: you have unresolved merge/rebase conflicts.\033[0m"; echo "\033[1;33m👉 Next steps:\033[0m"; echo "   • Run \033[1;37mgit status\033[0m to see conflicted files"; echo "   • Resolve conflicts and \033[1;37mgit add <file>\033[0m, OR"; echo "   • Abort with \033[1;37mgit reset --hard\033[0m to discard changes"; exit 1; fi; echo "\033[1;33m💾 Stashing local changes (if any)...\033[0m"; git stash push -m "auto-stash for grab $remote_branch" >/dev/null 2>&1 || true; if git rev-parse --verify $local_branch >/dev/null 2>&1; then echo "\033[1;34m🔄 Local branch exists, switching:\033[0m $local_branch"; git switch $local_branch; else echo "\033[1;32m✨ Creating and switching to new branch:\033[0m $local_branch"; git switch -c $local_branch $remote_branch; fi; echo "\033[1;33m📦 Restoring stashed changes...\033[0m"; git stash pop >/dev/null 2>&1 || echo "\033[1;90m(no stash to apply)\033[0m"; }; f'
```

**Usage:**
```bash
git grab origin/feature/new-ui
```

#### `git news` - Latest Remote Branch News
**What it does:** Shows latest commits from the most recently updated remote branches

**Windows (Git Bash):**
```bash
git config --global alias.news '!f() { branches=${1:-3}; commits=${2:-2}; echo "📰 Latest News from Remote Branches (Top $branches)"; echo ""; git --no-pager for-each-ref --sort=-committerdate refs/remotes/ --format="%(refname:short)" | head -$branches | while read branch; do echo "🌿 Branch: $branch"; git --no-pager log -$commits --format="   📅 Date: %C(bold green)%ci%C(reset)%n   👤 Author: %C(bold blue)%an%C(reset) <%C(dim white)%ae%C(reset)>%n   💬 Message: %C(white)%s%C(reset)%n   🔗 Commit: %C(dim white)%H%C(reset)%n" "$branch" 2>/dev/null || echo "   ❌ No commits found"; echo ""; done; echo "💡 Usage: git news [branches] [commits]"; echo "   Example: git news 5 3  (shows top 5 branches with 3 commits each)"; echo "   Defaults: git news = git news 3 2"; }; f'
```

**Usage:**
```bash
git news          # Shows top 3 branches, 2 commits each
git news 5 3      # Shows top 5 branches, 3 commits each
```

---

## Complete `.gitconfig` Section

You can also copy this entire section into your `C:\Users\YourUsername\.gitconfig` file:

```ini
[alias]
    st = status -sb
    ci = commit
    l = log --oneline
    lg = log --graph --abbrev-commit --decorate --format=format:\"%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)\"
    a = add .
    unstage = reset HEAD --
    bra = branch -a
    sw = switch
    gbrv = branch -r -v
    fa = fetch --all
    d = diff

    # Advanced aliases (require Git Bash)
    swc = "!f() { echo \"\\033[1;34m📖 Usage:\\033[0m git swc <new-branch-name> <remote>/<base-branch>\"; echo \"\\033[1;90m   Example: git swc feature/new-ui origin/main\\033[0m\"; echo \"\"; if [ -z \"$1\" ] || [ -z \"$2\" ]; then echo \"\\033[1;31m❌ Error:\\033[0m Missing arguments.\"; return 1; fi; remote=$(echo \"$2\" | cut -d'/' -f1); base_branch=$(echo \"$2\" | cut -d'/' -f2-); if git show-ref --verify --quiet refs/heads/\"$1\"; then echo \"\\033[1;31m❌ Error:\\033[0m Branch '\\033[1;33m\\033[0m' already exists locally.\"; return 1; fi; echo \"🚀 \\033[1;36mStarting robust branch creation...\\033[0m\"; echo \"🔄 Fetching latest updates from \\033[1;33m$remote\\033[0m...\"; if git fetch \"$remote\" >/dev/null 2>&1; then if git show-ref --verify --quiet refs/remotes/\"$2\"; then echo \"✨ Creating and switching to branch \\033[1;33m$1\\033[0m from \\033[1;33m$2\\033[0m\"; git switch -c \"$1\" \"$2\"; echo \"✅ \\033[1;32mDone! You are now on branch '\\033[1;33m\\033[0m'. Happy coding!\\033[0m\"; else echo \"\\033[1;31m❌ Error:\\033[0m Remote branch '\\033[1;33m\\033[0m' does not exist.\"; return 1; fi; else echo \"\\033[1;31m❌ Fetch from '\\033[1;33m\\033[0m' failed. Aborting branch creation.\\033[0m\"; return 1; fi; }; f"

    rb = "!f() { target=${1:-dev}; echo \"🚀 Fetching latest changes from origin...\"; git fetch origin && echo \"🔄 Rebasing $(git branch --show-current) onto origin/$target...\"; git rebase origin/$target && echo \"✅ Successfully rebased onto origin/$target!\"; }; f"
    rbi = "!f() { git fetch origin && git rebase -i origin/${1:-dev}; }; f"
    rbs = "!f() { git stash push -m \"auto-stash for rebase\" && git fetch origin && git rebase origin/${1:-dev} && git stash pop; }; f"
    rbonto = "!f() { git fetch origin && git rebase --onto origin/$1 origin/$2 HEAD; }; f"
    rbabort = "!git rebase --abort && echo \"🔥 Rebase aborted - back to safety!\""
    rbcont = "!git add . && git rebase --continue && echo \"✅ Rebase continued!\""

    grab = "!f() { remote_branch=$1; local_branch=${remote_branch#*/}; echo \"\\033[1;36m🌐 Fetching remote branch:\\033[0m $remote_branch\"; git fetch ${remote_branch%%/*} ${remote_branch#*/}; if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ] || git ls-files -u | grep -q .; then echo \"\\033[1;31m❌ Cannot grab: you have unresolved merge/rebase conflicts.\\033[0m\"; echo \"\\033[1;33m👉 Next steps:\\033[0m\"; echo \"   • Run \\033[1;37mgit status\\033[0m to see conflicted files\"; echo \"   • Resolve conflicts and \\033[1;37mgit add <file>\\033[0m, OR\"; echo \"   • Abort with \\033[1;37mgit reset --hard\\033[0m to discard changes\"; exit 1; fi; echo \"\\033[1;33m💾 Stashing local changes (if any)...\\033[0m\"; git stash push -m \\\"auto-stash for grab $remote_branch\\\" >/dev/null 2>&1 || true; if git rev-parse --verify $local_branch >/dev/null 2>&1; then echo \"\\033[1;34m🔄 Local branch exists, switching:\\033[0m $local_branch\"; git switch $local_branch; else echo \"\\033[1;32m✨ Creating and switching to new branch:\\033[0m $local_branch\"; git switch -c $local_branch $remote_branch; fi; echo \"\\033[1;33m📦 Restoring stashed changes...\\033[0m\"; git stash pop >/dev/null 2>&1 || echo \"\\033[1;90m(no stash to apply)\\033[0m\"; }; f"

    news = "!f() { branches=${1:-3}; commits=${2:-2}; echo \"📰 Latest News from Remote Branches (Top $branches)\"; echo \"\"; git --no-pager for-each-ref --sort=-committerdate refs/remotes/ --format=\"%(refname:short)\" | head -$branches | while read branch; do echo \"🌿 Branch: $branch\"; git --no-pager log -$commits --format=\"   📅 Date: %C(bold green)%ci%C(reset)%n   👤 Author: %C(bold blue)%an%C(reset) <%C(dim white)%ae%C(reset)>%n   💬 Message: %C(white)%s%C(reset)%n   🔗 Commit: %C(dim white)%H%C(reset)%n\" \"$branch\" 2>/dev/null || echo \"   ❌ No commits found\"; echo \"\"; done; echo \"💡 Usage: git news [branches] [commits]\"; echo \"   Example: git news 5 3  (shows top 5 branches with 3 commits each)\"; echo \"   Defaults: git news = git news 3 2\"; }; f"
```

---

## Important Notes for Windows

### 1. **Use Git Bash for Advanced Aliases**
   - The advanced aliases with emojis and colors work best in **Git Bash**
   - PowerShell may not render ANSI escape codes correctly
   - Windows Terminal with Git Bash is recommended

### 2. **Line Endings**
   - When editing `.gitconfig` on Windows, ensure it uses LF (Unix) line endings, not CRLF
   - Most text editors (VSCode, Notepad++) can convert this

### 3. **Shell Functions**
   - All aliases starting with `!f()` are shell functions and require Git Bash
   - They will NOT work in PowerShell or CMD without modifications

### 4. **Testing**
   - After setup, test with: `git st`, `git lg`, `git news`
   - Verify colors appear correctly in your terminal

### 5. **Troubleshooting**
   - If emojis don't appear, install a font with emoji support (e.g., Cascadia Code)
   - If colors don't work, ensure your terminal supports ANSI colors
   - For Git Bash issues, try running as administrator

---

## Quick Test Commands

After setup, test these commands to verify everything works:

```bash
git st              # Short status with colors
git lg              # Beautiful log graph
git bra             # List all branches
git news            # Latest remote branch news
git rb              # Rebase onto dev (if you have a dev branch)
```

---

## Migration Checklist

- [ ] Install Git for Windows (includes Git Bash)
- [ ] Open Git Bash or PowerShell
- [ ] Run the setup commands from "Quick Setup" section
- [ ] Test with `git st` and `git lg`
- [ ] Verify colors and emojis appear correctly
- [ ] Test advanced aliases like `git news` and `git grab`
- [ ] Done! 🎉

---

**Created:** 2025-10-11
**Source:** macOS git configuration
**Target:** Windows (Git Bash recommended)
