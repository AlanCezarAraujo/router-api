import chalk from 'chalk';

export function log(title = '', message: string) {
    console.log('');
    console.log(chalk.bgBlue.white.bold('I4 ROUTER • '), title ? chalk.bgBlue.white(`${title.toUpperCase()}:`) : '', message);
    console.log('');
}

export function warn(title = '', message: string) {
    console.log('');
    console.warn(chalk.bgYellow.white.bold('I4 ROUTER • '), title ? chalk.bgYellow.white(`${title.toUpperCase()}:`) : '', message);
    console.log('');
}
