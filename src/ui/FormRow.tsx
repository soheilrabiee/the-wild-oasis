import {
    Children,
    isValidElement,
    type JSX,
    type ReactElement,
    type ReactNode,
} from "react";
import styled from "styled-components";

const StyledFormRow = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 24rem 1fr 1.2fr;
    gap: 2.4rem;

    padding: 1.2rem 0;

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

const Label = styled.label`
    font-weight: 500;
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;

type FormRowProps = {
    // chid might be and input element with an id attribute or it might be some button elements with no id attribute
    children: ReactNode;
    label?: string;
    error?: string;
};

function FormRow({ label, error, children }: FormRowProps): JSX.Element {
    const childArray = Children.toArray(children);

    const firstChildWithId = childArray.find(
        (child) => isValidElement<{ id?: string }>(child) && "id" in child.props
    ) as ReactElement<{ id: string }> | undefined;

    return (
        <StyledFormRow>
            {firstChildWithId && label && (
                <Label htmlFor={firstChildWithId.props.id}>{label}</Label>
            )}

            {children}

            {firstChildWithId && error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}

export default FormRow;
