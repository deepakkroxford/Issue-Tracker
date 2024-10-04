'use client';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Button } from '@radix-ui/themes';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface IssueForm {
    title: string;
    description: string;
}

const NewIssuePage = () => {

    const router = useRouter();
    const { register, control, handleSubmit } = useForm<IssueForm>();

    // Handle form submission
    const onSubmit = async (data: IssueForm) => {
        try {
            await axios.post('/api/issues', data); // Use form data here
            router.push('/issues');
        } catch (error) {
            console.error('Failed to submit new issue:', error);
        }
    };

    return (
        <form className='max-w-xl space-y-3' onSubmit={handleSubmit(onSubmit)}>
            <TextField.Root>
                <TextField.Input placeholder='Title' {...register('title', { required: true })} />
            </TextField.Root>
            <Controller
                name='description'
                control={control}
                render={({ field }) => <SimpleMDE {...field} placeholder="Description" />}
            />
            <Button type="submit">Submit New Issue</Button>
        </form>
    );
};

export default NewIssuePage;
