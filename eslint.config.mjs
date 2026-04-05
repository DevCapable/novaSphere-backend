// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Logic for NovaSphere's rapid development
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      
      // Fixes: "Unsafe assignment of an error typed value"
      '@typescript-eslint/no-unsafe-assignment': 'off', 
      '@typescript-eslint/no-unsafe-argument': 'off',
      
      // Fixes: "Property has no initializer" (Optional but helpful here)
      // Note: This is usually a TS compiler setting, but we can ignore related lint hints
      'no-case-declarations': 'off',
      'no-useless-catch': 'off',
      
      
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-case-declarations': 'off',
      '@typescript-eslint/no-misused-promises': 'off',  
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',  
      '@typescript-eslint/await-thenable': 'off',  
      '@typescript-eslint/no-fallthrough': 'off',  

    },
  },
);