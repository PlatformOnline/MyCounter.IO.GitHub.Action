# MyCounter.IO GitHub Action

![License](https://img.shields.io/badge/license-MIT-blue.svg)

A GitHub Action to interact with the MyCounter.IO service. This action allows
you to read, increment, decrement, or set counter values from your MyCounter.IO
workspace directly in your GitHub workflows.

## Features

- ✅ Read counter values from MyCounter.IO
- ✅ Increment counter values
- ✅ Decrement counter values
- ✅ Set counter values to specific numbers
- ✅ Returns the counter value as an output for use in subsequent steps

## Prerequisites

Before using this action, you need:

1. A MyCounter.IO account with an active workspace
1. An API key from MyCounter.IO
1. At least one counter created in your workspace

## Inputs

| Input       | Description                                               | Required | Default |
| ----------- | --------------------------------------------------------- | -------- | ------- |
| `apikey`    | API Key for MyCounter.IO service                          | Yes      | -       |
| `workspace` | Workspace alias name in MyCounter.IO                      | Yes      | -       |
| `counter`   | Counter alias name in MyCounter.IO                        | Yes      | -       |
| `action`    | Action to perform: `get`, `increment`, `decrement`, `set` | Yes      | -       |
| `value`     | Value to use for increment, decrement, or set operations  | No       | `1`     |

## Outputs

| Output   | Description                                     |
| -------- | ----------------------------------------------- |
| `status` | The status of the action performed (true/false) |
| `action` | The action that was performed                   |
| `value`  | The counter value after performing the action   |

## Usage

### Basic Example: Get Counter Value

```yaml
name: Get Counter
on: [push]

jobs:
  get-counter:
    runs-on: ubuntu-latest
    steps:
      - name: Get counter value
        id: counter
        uses: YourUsername/MyCounter.IO.GitHub.Action@v1
        with:
          apikey: ${{ secrets.MYCOUNTER_API_KEY }}
          workspace: 'my-workspace'
          counter: 'my-counter'
          action: 'get'

      - name: Display counter value
        run: echo "Current counter value is ${{ steps.counter.outputs.value }}"
```

### Increment Counter

```yaml
- name: Increment counter
  id: increment
  uses: YourUsername/MyCounter.IO.GitHub.Action@v1
  with:
    apikey: ${{ secrets.MYCOUNTER_API_KEY }}
    workspace: 'my-workspace'
    counter: 'deployment-counter'
    action: 'increment'
    value: '1' # Optional: increment by 1 (default)
```

### Decrement Counter

```yaml
- name: Decrement counter
  id: decrement
  uses: YourUsername/MyCounter.IO.GitHub.Action@v1
  with:
    apikey: ${{ secrets.MYCOUNTER_API_KEY }}
    workspace: 'my-workspace'
    counter: 'my-counter'
    action: 'decrement'
    value: '5' # Decrement by 5
```

### Set Counter to Specific Value

```yaml
- name: Set counter value
  id: set-counter
  uses: YourUsername/MyCounter.IO.GitHub.Action@v1
  with:
    apikey: ${{ secrets.MYCOUNTER_API_KEY }}
    workspace: 'my-workspace'
    counter: 'my-counter'
    action: 'set'
    value: '100' # Set counter to 100
```

### Complete Workflow Example

Here's a complete example that tracks deployment counts:

```yaml
name: Deploy and Track

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Increment deployment counter
        id: deploy-count
        uses: YourUsername/MyCounter.IO.GitHub.Action@v1
        with:
          apikey: ${{ secrets.MYCOUNTER_API_KEY }}
          workspace: 'production'
          counter: 'deployments'
          action: 'increment'

      - name: Deploy application
        run: |
          echo "Deploying application..."
          # Your deployment commands here

      - name: Report deployment
        if: steps.deploy-count.outputs.status == 'true'
        run: |
          echo "Deployment #${{ steps.deploy-count.outputs.value }} completed successfully!"
```

## Security

⚠️ **Important**: Always store your MyCounter.IO API key as a GitHub secret.
Never commit API keys directly in your workflow files.

To add a secret:

1. Go to your repository settings
1. Navigate to "Secrets and variables" → "Actions"
1. Click "New repository secret"
1. Add your `MYCOUNTER_API_KEY`

## Error Handling

The action will fail if:

- Invalid API key is provided
- Workspace or counter does not exist
- Network connectivity issues
- Invalid action specified

Check the action logs for detailed error messages.

## API Endpoint

This action interacts with the MyCounter.IO API at:

```text
https://api.mycounter.io/{workspace}/counter/{counter}
```

## Development

### Setup

```bash
npm install
```

### Testing

```bash
npm run test
```

### Building

```bash
npm run bundle
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Support

For issues related to:

- **This GitHub Action**: Open an issue in this repository
- **MyCounter.IO Service**: Contact MyCounter.IO support

## Links

- [MyCounter.IO Site](https://mycounter.io)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
