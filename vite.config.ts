import { reactRouter } from '@react-router/dev/vite';
import {
	sentryReactRouter,
	type SentryReactRouterBuildOptions,
} from '@sentry/react-router';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const sentryConfig: SentryReactRouterBuildOptions = {
	org: 'js-mastery-m2',
	project: 'travel-agency',
	// An auth token is required for uploading source maps.
	authToken:
		'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',
	// ...
};

export default defineConfig((config) => {
	return {
		plugins: [
			tailwindcss(),
			reactRouter(),
			tsconfigPaths(),
			sentryReactRouter(sentryConfig, config),
		],
		ssr: {
			noExternal: [/@syncfusion/],
		},
		sentryConfig,
	};
});
