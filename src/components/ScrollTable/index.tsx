import { css } from "@emotion/css"
import { AutoScroll, AutoScrollProps, Scroll, ScrollOptions, Scrollbar } from "deepsea-components"
import { CSSProperties, ForwardedRef, Fragment, ReactNode, forwardRef, useImperativeHandle, useRef } from "react"
import { clsx } from "snowye-tools"
import { twMerge } from "tailwind-merge"

type GetRequired<T extends Record<string, any>> = {
    [K in keyof Required<T>]: T[K]
}

type ColumnList<T extends Record<string, any>> = {
    [K in keyof GetRequired<T>]: {
        key?: string
        dataIndex: K
        title: ReactNode
        width?: number
        align?: CSSProperties["textAlign"]
        render?(item: GetRequired<T>[K], record: GetRequired<T>, index: number, list: GetRequired<T>[]): ReactNode
    }
}

export type ColumnItem<T extends Record<string, any>> =
    | ColumnList<T>[keyof GetRequired<T>]
    | {
          key?: string
          dataIndex?: undefined
          title: ReactNode
          width?: number
          align?: CSSProperties["textAlign"]
          render?(record: GetRequired<T>, index: number, list: GetRequired<T>[]): ReactNode
      }

export interface ColorExtractorConfig {
    key: string | number | undefined
    color: string
}

export interface ScrollTableProps<T extends Record<string, any>> {
    className?: string
    style?: CSSProperties
    titleClassName?: string
    titleHeight?: number
    /** 行 类名 */
    rowClassName?: string
    /** 单元格类名 */
    unitClassName?: string
    dataSource: T[]
    columns: ColumnItem<T>[]
    rowKey?: keyof T
    /** 数字为滚动条高度 */
    scroll?: number | (AutoScrollProps & { height: number })
    ScrollOption?: ScrollOptions
    /** 单元格之间的内容生成器 */
    conditionDom?: { condition: (item: T, index: number, list: T[]) => void; render: ReactNode }[]
}

export type ScrollTableRef = {
    scrollBar: Scrollbar | null
    container: HTMLDivElement | null
}

export const ScrollTable = forwardRef(<T extends Record<string, any>>(props: ScrollTableProps<T>, ref: ForwardedRef<ScrollTableRef>) => {
    const { className, style, dataSource, columns, rowKey, scroll, conditionDom = [], rowClassName, unitClassName, ScrollOption, titleClassName, titleHeight = 44 } = props

    const scrollBar = useRef<Scrollbar>(null)

    const container = useRef<HTMLDivElement>(null)

    useImperativeHandle(
        ref,
        () => {
            return {
                scrollBar: scrollBar.current,
                container: container.current
            }
        },
        []
    )

    const body =
        scroll === undefined || scroll === null ? (
            <Fragment>
                {dataSource.map((item, index, array) => {
                    return (
                        <Fragment key={rowKey ? item[rowKey] : index}>
                            <div
                                className={clsx(
                                    css`
                                        display: flex;
                                        align-items: center;
                                        transition: all 500ms;
                                    `,
                                    rowClassName
                                )}
                            >
                                {columns.map((it, idx) => {
                                    const { dataIndex, render, width, key, align } = it
                                    let children: ReactNode = undefined
                                    if (typeof dataIndex === "string" && render) {
                                        children = (render as (item: T[keyof T], record: T, index: number, array: T[]) => ReactNode)(item[dataIndex], item, index, array)
                                    }
                                    if (typeof dataIndex === "string" && !render) {
                                        children = item[dataIndex] as ReactNode
                                    }
                                    if (dataIndex === undefined && render) {
                                        children = (render as (record: T, index: number, array: T[]) => ReactNode)(item, index, array)
                                    }
                                    return (
                                        <div
                                            key={key ?? (dataIndex as string) ?? idx}
                                            className={twMerge(
                                                css`
                                                    padding: 8px;
                                                `,
                                                unitClassName
                                            )}
                                            style={{ width, textAlign: align ?? "center", flex: width ? "none" : 1 }}
                                        >
                                            {children}
                                        </div>
                                    )
                                })}
                            </div>
                            {conditionDom.find(key => key.condition(item, index, array)) && conditionDom.find(key => key.condition(item, index, array))?.render}
                        </Fragment>
                    )
                })}
            </Fragment>
        ) : typeof scroll === "number" ? (
            <Scroll options={ScrollOption}>
                <div style={{ maxHeight: scroll - titleHeight }}>
                    {dataSource.map((item, index, array) => {
                        return (
                            <Fragment key={rowKey ? item[rowKey] : index}>
                                <div
                                    className={clsx(
                                        css`
                                            display: flex;
                                            align-items: center;
                                            transition: all 500ms;
                                        `,
                                        rowClassName
                                    )}
                                >
                                    {columns.map((it, idx) => {
                                        const { dataIndex, render, width, key, align } = it
                                        let children: ReactNode = undefined
                                        if (typeof dataIndex === "string" && render) {
                                            children = (render as (item: T[keyof T], record: T, index: number, array: T[]) => ReactNode)(item[dataIndex], item, index, array)
                                        }
                                        if (typeof dataIndex === "string" && !render) {
                                            children = item[dataIndex] as ReactNode
                                        }
                                        if (dataIndex === undefined && render) {
                                            children = (render as (record: T, index: number, array: T[]) => ReactNode)(item, index, array)
                                        }
                                        return (
                                            <div
                                                key={key ?? (dataIndex as string) ?? idx}
                                                className={clsx(
                                                    css`
                                                        padding: 8px;
                                                    `,
                                                    unitClassName
                                                )}
                                                style={{ width, textAlign: align ?? "center", flex: width ? "none" : 1 }}
                                            >
                                                {children}
                                            </div>
                                        )
                                    })}
                                </div>
                                {conditionDom.find(key => key.condition(item, index, array)) && conditionDom.find(key => key.condition(item, index, array))?.render}
                            </Fragment>
                        )
                    })}
                </div>
            </Scroll>
        ) : (
            <AutoScroll options={ScrollOption} itemHeight={scroll.itemHeight} duration={scroll.duration} animation={scroll.animation} count={scroll.count} scrollbar={scrollBar}>
                <div style={{ maxHeight: scroll.height }}>
                    {dataSource.map((item, index, array) => {
                        return (
                            <div
                                key={rowKey ? item[rowKey] : index}
                                className={clsx(
                                    css`
                                        display: flex;
                                        align-items: center;
                                        transition: all 500ms;
                                    `,
                                    rowClassName
                                )}
                            >
                                {columns.map((it, idx) => {
                                    const { dataIndex, render, width, key, align } = it
                                    let children: ReactNode = undefined
                                    if (typeof dataIndex === "string" && render) {
                                        children = (render as (item: T[keyof T], record: T, index: number, array: T[]) => ReactNode)(item[dataIndex], item, index, array)
                                    }
                                    if (typeof dataIndex === "string" && !render) {
                                        children = item[dataIndex] as ReactNode
                                    }
                                    if (dataIndex === undefined && render) {
                                        children = (render as (record: T, index: number, array: T[]) => ReactNode)(item, index, array)
                                    }
                                    return (
                                        <div
                                            key={key ?? (dataIndex as string) ?? idx}
                                            className={clsx(
                                                css`
                                                    padding: 8px;
                                                `,
                                                unitClassName
                                            )}
                                            style={{ width, textAlign: align ?? "center", flex: width ? "none" : 1 }}
                                        >
                                            {children}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </AutoScroll>
        )

    return (
        <div ref={container} className={className} style={style}>
            <div
                className={clsx(
                    css`
                        display: flex;
                        align-items: center;
                        transition: all 500ms;
                        height: ${titleHeight}px;
                    `
                )}
            >
                {columns.map((it, idx) => (
                    <div
                        key={it.key ?? (it.dataIndex as string) ?? idx}
                        className={clsx(
                            css`
                                width: ${it.width}px;
                                height: ${titleHeight}px;
                                line-height: ${titleHeight}px;
                                text-align: ${it.align ?? "center"};
                                flex: ${it.width ? "none" : 1};
                            `,
                            titleClassName
                        )}
                    >
                        {it.title}
                    </div>
                ))}
            </div>
            {dataSource.length > 0 ? (
                body
            ) : (
                <div
                    className={clsx(
                        css`
                            padding: 8px;
                            text-align: center;
                        `
                    )}
                >
                    暂无数据
                </div>
            )}
        </div>
    )
}) as <T extends Record<string, any>>(props: ScrollTableProps<T> & { ref?: ForwardedRef<ScrollTableRef> }) => React.ReactElement
