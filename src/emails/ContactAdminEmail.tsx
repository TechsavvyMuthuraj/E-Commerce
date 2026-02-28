import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';

interface ContactAdminEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
    ticketId: string;
    product?: string;
}

export const ContactAdminEmail = ({
    name,
    email,
    subject,
    message,
    ticketId,
    product,
}: ContactAdminEmailProps) => {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>[New Contact Tracker] {subject}</Heading>
                    <Text style={text}>
                        <strong>Sender Name:</strong> {name} <br />
                        <strong>Sender Email:</strong> <Link href={`mailto:${email}`}>{email}</Link> <br />
                        {product && (
                            <>
                                <strong>Product Attached:</strong> {product} <br />
                            </>
                        )}
                        <strong>Ticket ID:</strong> {ticketId}
                    </Text>
                    <Hr style={hr} />
                    <Section>
                        <Text style={messageLabel}>Message Integrity Log:</Text>
                        <Text style={messageBody}>{message}</Text>
                    </Section>
                    <Hr style={hr} />
                    <Section style={btnContainer}>
                        <Link href={`mailto:${email}`} style={button}>
                            Direct Reply
                        </Link>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#0a0a0a',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
    backgroundColor: '#1E1E20',
    border: '1px solid #333',
    borderRadius: '5px',
    margin: '40px auto',
    padding: '20px',
    maxWidth: '600px',
};

const heading = {
    color: '#F5A623',
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '0',
};

const text = {
    color: '#e0e0e0',
    fontSize: '14px',
    lineHeight: '24px',
};

const hr = {
    borderColor: '#333',
    margin: '20px 0',
};

const messageLabel = {
    color: '#888',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
};

const messageBody = {
    color: '#e0e0e0',
    fontSize: '16px',
    lineHeight: '26px',
    whiteSpace: 'pre-wrap' as const,
    backgroundColor: '#1a1a1e',
    padding: '15px',
    borderRadius: '4px',
};

const btnContainer = {
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#F5A623',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    padding: '12px 24px',
    borderRadius: '4px',
};

export default ContactAdminEmail;
