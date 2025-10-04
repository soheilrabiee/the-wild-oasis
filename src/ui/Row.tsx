import type React from "react";
import styled, { css } from "styled-components";

type RowProps = {
    $type?: "horizontal" | "vertical";
};

const StyledRow = styled.div<RowProps>`
    display: flex;

    ${(props) =>
        props.$type === "horizontal" &&
        css`
            justify-content: space-between;
            align-items: center;
        `}

    ${(props) =>
        props.$type === "vertical" &&
        css`
            flex-direction: column;
            gap: 1.6rem;
        `}
`;

// Using a wrapper to handle default props passing in to the styled component
type Wrapper = RowProps & React.ComponentPropsWithoutRef<"div">;

function Row({ $type = "horizontal", ...rest }: Wrapper) {
    return <StyledRow $type={$type} {...rest}></StyledRow>;
}

export default Row;
