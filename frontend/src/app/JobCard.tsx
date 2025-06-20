import { Card, Text, Badge, Group, Avatar, List, Button } from '@mantine/core';

export default function JobCard({ job }: { job: any }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <Avatar src={job.logo} size="lg" />
        <Badge color="blue" variant="light">{job.posted}</Badge>
      </Group>

      <Text fw={600} mt="md" size="lg">{job.title}</Text>

      <Group gap="xs" mt="xs">
        <Text size="sm">👤 {job.experience}</Text>
        <Text size="sm">📍 {job.location}</Text>
        <Text size="sm">💰 {job.salary}</Text>
      </Group>

      <List size="sm" spacing="xs" mt="sm">
        {job.summary.map((item: string, i: number) => (
          <List.Item key={i}>{item}</List.Item>
        ))}
      </List>

      <Button fullWidth mt="md" color="blue" radius="md">Apply Now</Button>
    </Card>
  );
}
