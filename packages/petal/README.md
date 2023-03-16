# Petal

## Usage

```sh
yarn add --dev @pulse/petal husky
```

Add the scripts and commit hooks to your package.json:

```json
{
	"scripts": {
		"test": "petal test",
		"lint": "petal lint",
		"format": "petal format",
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
