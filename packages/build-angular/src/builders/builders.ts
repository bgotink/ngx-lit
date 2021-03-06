import type {BuilderContext} from '@angular-devkit/architect';
import {
	BrowserBuilderOptions,
	DevServerBuilderOptions,
	ExtractI18nBuilderOptions,
	executeBrowserBuilder as _executeBrowserBuilder,
	executeDevServerBuilder as _executeDevServerBuilder,
	executeExtractI18nBuilder as _executeExtractI18nBuilder,
} from '@angular-devkit/build-angular';

import {installLoader} from '../loader/install-loader.js';

type BrowserBuilderTransforms = NonNullable<
	Parameters<typeof _executeBrowserBuilder>[2]
>;
type DevServerBuilderTransforms = NonNullable<
	Parameters<typeof _executeDevServerBuilder>[2]
>;
type ExtractI18nBuilderTransforms = NonNullable<
	Parameters<typeof _executeExtractI18nBuilder>[2]
>;

function modifyTransform<
	T extends
		| BrowserBuilderTransforms
		| DevServerBuilderTransforms
		| ExtractI18nBuilderTransforms,
>(value?: T): T {
	return {
		...value,
		webpackConfiguration(config) {
			if (value?.webpackConfiguration) {
				return value.webpackConfiguration(installLoader(config));
			} else {
				return installLoader(config);
			}
		},
	} as T;
}

export function executeBrowserBuilder(
	options: BrowserBuilderOptions,
	context: BuilderContext,
	transforms?: BrowserBuilderTransforms,
): ReturnType<typeof _executeBrowserBuilder> {
	return _executeBrowserBuilder(options, context, modifyTransform(transforms));
}

export function executeDevServerBuilder(
	options: DevServerBuilderOptions,
	context: BuilderContext,
	transforms?: DevServerBuilderTransforms,
): ReturnType<typeof _executeDevServerBuilder> {
	return _executeDevServerBuilder(
		options,
		context,
		modifyTransform(transforms),
	);
}

export function executeExtractI18nBuilder(
	options: ExtractI18nBuilderOptions,
	context: BuilderContext,
	transforms?: ExtractI18nBuilderTransforms,
): ReturnType<typeof _executeExtractI18nBuilder> {
	return _executeExtractI18nBuilder(
		options,
		context,
		modifyTransform(transforms),
	);
}
