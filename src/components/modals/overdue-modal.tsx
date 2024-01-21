import { BaseModalWrapper } from '@/components/modals/base-modal';
import { Group, Avatar, Text, Accordion, Button } from '@mantine/core';

const charactersList = [
  {
    id: '1',
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    label: 'Bender Bending Rodríguez',
    description: 'Fascinated with cooking, though has no sense of taste',
    content: "Bender Bending Rodríguez, (born September 4, 2996), designated Bending Unit 22, and commonly known as Bender, is a bending unit created by a division of MomCorp in Tijuana, Mexico, and his serial number is 2716057. His mugshot id number is 01473. He is Fry's best friend.",
  },

  {
    id: '2',
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Carol Miller',
    description: 'One of the richest people on Earth',
    content: "Carol Miller (born January 30, 2880), better known as Mom, is the evil chief executive officer and shareholder of 99.7% of Momcorp, one of the largest industrial conglomerates in the universe and the source of most of Earth's robots. She is also one of the main antagonists of the Futurama series.",
  },

  {
    id: '3',
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    label: 'Homer Simpson',
    description: 'Overweight, lazy, and often ignorant',
    content: 'Homer Jay Simpson (born May 12) is the main protagonist and one of the five main characters of The Simpsons series(or show). He is the spouse of Marge Simpson and father of Bart, Lisa and Maggie Simpson.',
  },
];



export const OverdueModal = () => {
  return <BaseModalWrapper title={'Payment Overdue'} open={true}
                            content={
                                Demo()
                            }
                           footer={
                             <Group
                             spacing={12}
                                position="right"
                             >
                               <Button variant="light" loading={false}>
                                 Skip
                               </Button>
                               <Button variant="filled" loading={false}>
                                 Pay Now
                               </Button>
                             </Group>  }
  />;
};

function AccordionLabel({ label, image, description }: AccordionLabelProps) {
  return (
      <Group wrap="nowrap">
        <Avatar src={image} radius="xl" size="lg" />
        <div>
          <Text>{label}</Text>
          <Text size="sm" c="dimmed" fw={400}>
            {description}
          </Text>
        </div>
      </Group>
  );
}


function Demo() {
    const items = charactersList.map((item) => (
        <Accordion.Item value={item.id} key={item.label}>
                <AccordionLabel {...item} />
                <Text size="sm">{item.content}</Text>
        </Accordion.Item>
    ));

    return (
        <Accordion chevronPosition="right" variant="contained">
            {items}
        </Accordion>
    );
}

