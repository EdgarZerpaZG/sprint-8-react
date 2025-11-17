import type { TOneProps } from './tOneTypes';

export default function T1({ title, style }: TOneProps) {
    return (
        <h1 className={style}>{title}</h1>
    );
}