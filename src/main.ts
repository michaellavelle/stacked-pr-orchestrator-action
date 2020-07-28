import {debug, setFailed, getInput} from '@actions/core'
import * as GitHub from '@actions/github'
import {context} from '@actions/github'
import {stackedPROrchestrator} from './stacked-pr-orchestrator'

async function run(): Promise<void> {
  try {
    debug('start action')
    const token = process.env.GITHUB_TOKEN
    if (!token) throw ReferenceError('No Token found')
    debug('attempt to run action')
    await stackedPROrchestrator({
      debug,
      setFailed,
      getInput,
      octokit: GitHub.getOctokit(token),
      context
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run()
