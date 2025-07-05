import { createDecorator } from '../../shared/utils/createDecorator';

export const IS_PUBLIC_KEY = 'custom:isPublic';

export const IsPublic = () => createDecorator(IS_PUBLIC_KEY, true);
