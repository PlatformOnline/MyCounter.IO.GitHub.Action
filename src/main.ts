import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    const apikey = core.getInput('apikey', { required: true })
    const workspace = core.getInput('workspace', { required: true })
    const counter = core.getInput('counter', { required: true })
    const action = core.getInput('action', { required: true })

    core.debug(`API Key: ${apikey}`)
    core.debug(`Workspace: ${workspace}`)
    core.debug(`Counter: ${counter}`)
    core.debug(`Action: ${action}`)

    switch (action) {
      case 'increment':
      case 'decrement':
      case 'set':
        break
      default:
        core.setFailed(
          `Invalid action: ${action}. Valid actions are increment, decrement, reset.`
        )
        return
    }

    const response = await fetch(
      `https://api.mycounter.io/${workspace}/counter/${counter}/${action}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apikey}`
        },
        body: JSON.stringify({ action })
      }
    )

    if (!response.ok) {
      core.setFailed(`Error performing action: ${response.statusText}`)
      core.setOutput('status', false)
      return
    }

    const data: any = await response.json()
    if (!data.status) {
      core.setFailed(`${data.messages.join(', ')}`)
      core.setOutput('status', false)
      return
    }
    if (data.status && data.data && typeof data.data.value) {
      const value = data.data.value
      core.debug(`Counter Value: ${value}`)

      core.setOutput('action', action)
      core.setOutput('value', value)
      core.setOutput('status', true)
      return
    } else {
      core.setFailed(`Invalid response from server.`)
      core.setOutput('status', false)
      return
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
      core.setOutput('status', false)
    }
  }
}
