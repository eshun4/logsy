
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('toggleTask', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        cleanup()
    })

    it('marks an incomplete task as completed', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.type(
            screen.getByPlaceholderText('What do you need to accomplish?'),
            'Complete homework'
        )
        await user.click(screen.getByRole('button', { name: 'Add task' }))

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).not.toBeChecked()

        await user.click(checkbox)

        expect(checkbox).toBeChecked()
        expect(screen.getByText('1 of 1 completed')).toBeInTheDocument()
    })

    it('marks a completed task as incomplete', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.type(
            screen.getByPlaceholderText('What do you need to accomplish?'),
            'Study for exam'
        )
        await user.click(screen.getByRole('button', { name: 'Add task' }))

        const checkbox = screen.getByRole('checkbox')

        await user.click(checkbox)
        expect(checkbox).toBeChecked()

        await user.click(checkbox)

        expect(checkbox).not.toBeChecked()
        expect(screen.getByText('0 of 1 completed')).toBeInTheDocument()
    })

    it('does not change the completion status of other tasks', async () => {
        const user = userEvent.setup()
        render(<App />)

        const input = screen.getByPlaceholderText(
            'What do you need to accomplish?'
        )

        await user.type(input, 'Task A')
        await user.click(screen.getByRole('button', { name: 'Add task' }))

        await user.type(input, 'Task B')
        await user.click(screen.getByRole('button', { name: 'Add task' }))

        const taskA = screen.getByText('Task A').closest('label')
        const taskB = screen.getByText('Task B').closest('label')

        const checkboxA = taskA.querySelector('input[type="checkbox"]')
        const checkboxB = taskB.querySelector('input[type="checkbox"]')

        await user.click(checkboxA)

        expect(checkboxA).toBeChecked()
        expect(checkboxB).not.toBeChecked()
        expect(screen.getByText('1 of 2 completed')).toBeInTheDocument()
    })

    it('keeps task status unchanged when no checkbox is toggled', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.type(
            screen.getByPlaceholderText('What do you need to accomplish?'),
            'Read textbook'
        )
        await user.click(screen.getByRole('button', { name: 'Add task' }))

        const checkbox = screen.getByRole('checkbox')

        expect(checkbox).not.toBeChecked()
        expect(screen.getByText('0 of 1 completed')).toBeInTheDocument()
    })
})
