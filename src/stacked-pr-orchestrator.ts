import {ActionContext} from './action-context'
const core = require('@actions/core')
const github = require('@actions/github')

export async function stackedPROrchestrator(
  actionContext: ActionContext
): Promise<void> {
  try {
    const pr_initial = github.context.payload.pull_request
    let prNumber;
    if (pr_initial) {
        prNumber = pr_initial.number
    }
    else {
        actionContext.setFailed('No PR')
        return;
    }
    core.debug(`Checking base branch for PR #${prNumber}`)
    const payload = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
    };
    const pr = await actionContext.octokit.pulls.get(Object.assign({}, payload))
    const pr_branch = pr.data.head.ref;
    const pr_base_branch = pr.data.base.ref;
    core.debug(`Obtained branch for PR ${pr_branch}`);
    const repoInfo = actionContext.context.repo;
    const params = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
    };
    const { data: pulls } = await actionContext.octokit.pulls.list(params)
    for (const pull in pulls) {
        const pull_number2 = pulls[pull].number;
        core.debug(`found ${pull_number2}`);
        const pullParams = {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: pull_number2
        };
        const pullObj = await actionContext.octokit.pulls.get(Object.assign({}, pullParams))
        let hasLabel = false
        for (const label in pullObj.data.labels) {
            const label_name = pullObj.data.labels[label].name
            if (label_name.lastIndexOf("stacked:", 0) === 0) {
              if (label_name.substring(8) == pr_base_branch) {
                hasLabel = true
              }
            }
        }

        if (pullObj.data.base.ref == pr_branch && hasLabel) {
            await actionContext.octokit.pulls.update({
                base: pr_base_branch,
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: pull_number2
            });
            core.info(`Updated base branch of PR #${pull_number2} from ${pullObj.data.base.ref} to ${pr_base_branch}`)
        }
    }

  } catch (error) {
    actionContext.setFailed(error.message)
  }
}
