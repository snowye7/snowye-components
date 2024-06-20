import { css } from "@emotion/css"
import { CSSProperties, HTMLAttributes, PropsWithChildren, forwardRef, useImperativeHandle, useRef } from "react"
import { clsx } from "snowye-tools"

export type CornersProps = HTMLAttributes<HTMLDivElement> &
    PropsWithChildren & {
        showCorner?: boolean
        className?: string
        color?: string
        /**
         * @default 8
         * @description 角的长宽
         */
        cornerWidth?: number
        /**
         * @default 1
         * @description 角的厚度
         */
        cornerSize?: number
        style?: CSSProperties
    }

export const Corners = forwardRef<HTMLDivElement, CornersProps>((props, ref) => {
    const { children, showCorner = true, className, color = "#000", cornerSize = 1, cornerWidth = 8, style, ...rest } = props

    const divRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(
        ref,
        () => {
            return divRef.current!
        },
        []
    )

    return (
        <div
            className={clsx(
                css`
                    position: relative;
                `,
                className
            )}
            ref={divRef}
            style={style}
            {...rest}
        >
            {showCorner && (
                <>
                    <div style={{ position: "absolute", top: 0, left: 0, width: cornerWidth, height: cornerWidth, borderLeft: `${cornerSize}px solid ${color}`, borderTop: `${cornerSize}px solid ${color}` }}></div>
                    <div style={{ position: "absolute", top: 0, right: 0, width: cornerWidth, height: cornerWidth, borderRight: `${cornerSize}px solid ${color}`, borderTop: `${cornerSize}px solid ${color}` }}></div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, width: cornerWidth, height: cornerWidth, borderLeft: `${cornerSize}px solid ${color}`, borderBottom: `${cornerSize}px solid ${color}` }}></div>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: cornerWidth, height: cornerWidth, borderRight: `${cornerSize}px solid ${color}`, borderBottom: `${cornerSize}px solid ${color}` }}></div>
                </>
            )}
            {children}
        </div>
    )
})
