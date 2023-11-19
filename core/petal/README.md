# Petal

## Usage

```sh
yarn add --dev @flowr/petal husky
```

Add the scripts and commit hooks to your package.json:

```json
{
	"scripts": {
		"test": "petal test",
		"lint": "petal lint",
		"build": "petal build",
		"commit": "petal commit",
		"release": "petal release"
	},
	"husky": {
		"hooks": {
			"commit-msg": "petal commitmsg",
			"pre-commit": "petal precommit"
		}
	}
}
```
