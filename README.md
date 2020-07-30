# GitHub action to orchestrate the base branches of a stack of chained PRs on merge.

For any PR merge (eg. branch1 -> main) this action will find any other PRs raised on branches of the same fork (eg. branch2 -> branch1) which had the branch of the first PR as their base branch,  and will update their base branch to be the base branch of the merged PR (eg. main).

The stacked PRs ( those in a chain behind the first PR ) must be tagged with the label "stacked:<final_targetbranch_name>" to be considered by this action.

For example, if

PR1 requests a merge from branch1 to main.
PR2 requests a merge from branch2 to branch1

and if PR2 is labeled with "stacked:main" in order to be considered.

On merge of PR1,  PR2 will have it's base branch modified to be main.


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
      - uses: michaellavelle/stacked-pr-orchestrator-action@initial-label-criteria
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
