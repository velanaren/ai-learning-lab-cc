# AI Learning Lab - Task Execution Process

**Environment Context:**
- Project: AI Learning Lab
- Branch: feature/ai-learning-lab
- Working Directory: /Users/velayuthamsankaran/projects/claude/ai-learning-lab-cc/ai-learning-lab
- Dev Server: http://localhost:3001 (port 3000 = Grafana)
- Database: PostgreSQL container (ai-learning-lab-db)
- OAuth: CONFIGURED (.env has all credentials)
- Design System: DESIGN_SYSTEM.md

---

## 5-Step Task Execution Process

### STEP 1: Execute Task
- Complete implementation following task requirements
- Follow DESIGN_SYSTEM.md for all UI/UX work
- Mark task as complete in TodoWrite

### STEP 2: Multi-Role Expert Review

Evaluate from these perspectives:

#### Senior UX Engineer
- Critically evaluate the UI
- Ensure the UI/UX is production ready
- Check accessibility, responsiveness, user flow

#### Senior QA Engineer
- Are all test scenarios covered?
- Any edge cases we missed? (expired session, network errors, etc.)
- Are error messages user-friendly?
- Can we add automated tests for this flow?

#### Senior Security Engineer
- Is the OAuth flow secure? (CSRF tokens, state parameters)
- Are sessions properly validated?
- Any security vulnerabilities in authentication?
- Is user data handled securely?

#### Senior Developer
- Any console errors during testing?
- Performance issues during auth flow?
- Are redirects working correctly?
- Any race conditions or async issues?

#### Senior DevOps Engineer
- Are environment variables properly configured?
- Database connection stable?
- Any scalability concerns with auth flow?

**Output Format:**
- **MUST Fix:** Critical issues that block production
- **SHOULD Fix:** Important improvements for production readiness
- **NICE TO HAVE:** Enhancements for better UX
- **Overall Rating:** X/10 for production readiness

### STEP 3: Design Principles Review

If it is a UI/UX task:
- Ensure it follows DESIGN_SYSTEM.md
- Check typography, colors, spacing, components
- Verify responsive design
- Confirm accessibility standards

Provide:
- Design inconsistencies found
- Suggestions for improvement
- **Design Rating:** X/10

### STEP 4: Wait for Approval

Present findings in this format:

```markdown
## Testing Results:
[Summary of what worked and what failed]

## Multi-Role Expert Review:

**MUST Fix:**
1. ...
2. ...

**SHOULD Fix:**
1. ...
2. ...

**NICE TO HAVE:**
1. ...
2. ...

**Production-Ready Score:** X/10

## Design Principles Review:
[Any design inconsistencies found]

**Design Rating:** X/10

---

Should I proceed with implementing the recommended fixes?
```

**Wait for user approval on which items to implement.**

### STEP 5: Implement Approved Changes

After approval:
- Implement all fixes approved by user
- Test again to verify fixes work
- Update code with improvements
- Confirm all issues resolved
- Update TodoWrite to mark as completed

---

## Key Reminders

- Always follow DESIGN_SYSTEM.md for UI work
- Never skip the multi-role review
- Always wait for user approval before implementing fixes
- Test thoroughly after implementing changes
- Keep todo list updated with TodoWrite
