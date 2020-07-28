# GitHub action to orchestrate the base branches of a stack of chained PRs on merge.

After installation for any PR merge (eg. branch1 -> main) this action will find any other PRs (eg. branch2 -> branch1) which had the branch of the first PR as their base branch,  and will update their base branch
to be the base branch of the merged PR (eg. main)

This allows a chain of PRs to be managed automatically.

eg. PR3 -> PR2 -> PR1 -> main

after merge of PR1 -> main,  will become

PR3 -> PR2 -> main

which after merge of PR2 -> main will become

PR3 -> main

PRs can be build up incrementally, with each showing the deltas as a diff,  yet have their base Branches
automatically updated as needed.

## Installation

To configure the action add the following lines to your `.github/workflows/stacked-pr-orchestrator.yml` workflow file:

```yml
name: Stacked PR Orchestrator
on: # PR
    pull_request:
      types: [closed]
jobs:
  orchestrate:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ./
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
