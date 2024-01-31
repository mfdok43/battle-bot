	"scripts": {
		"start": "nodemon",
		"serve": "node dist/index.js",
		"build": "tsc",
		"watch": "tsc --watch",
		"format": "npx prettier --write ./src/**",
		"lint": "eslint ./src/**",
		"lint:fix": "eslint ./src/** --fix"
	}
