import config from '../config';

export function wait(miliseconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds)
    })
}
