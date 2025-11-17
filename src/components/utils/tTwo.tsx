import type { TOneProps } from './tOneTypes';

export default function T2({ title, style }: TOneProps) {
    return (
        <h2 className={style}>{title}</h2>
    );
}