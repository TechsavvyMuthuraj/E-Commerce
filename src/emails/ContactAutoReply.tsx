import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from '@react-email/components';

interface ContactAutoReplyProps {
    name: string;
    subject: string;
    ticketId: string;
}

export const ContactAutoReply = ({ name, subject, ticketId }: ContactAutoReplyProps) => {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Message Received — EXE TOOL</Heading>
                    <Text style={text}>
                        Operator {name}, <br /> <br />
                        This is an automated system response to confirm we have received your direct transmission regarding: <br />
                        <strong>"{subject}"</strong>
                    </Text>
                    <Section style={infoBox}>
                        <Text style={infoText}>
                            <strong>Ticket ID:</strong> {ticketId} <br />
                            <strong>Est. Response Velocity:</strong> &lt; 24 hours
                        </Text>
                    </Section>
                    <Text style={text}>
                        Our engineers will review your logs and follow up with you on this channel shortly. In the meantime, you can review our live architecture below:
                    </Text>
                    <Section style={linkContainer}>
                        <Link href="http://localhost:3000/products" style={quickLink}>EXE TOOL Catalog</Link>
                        <Link href="http://localhost:3000/dashboard" style={quickLink}>Operator Dashboard</Link>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        EXE TOOL | Premium Windows Software
                    </Text>
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
    padding: '30px',
    maxWidth: '600px',
};

const heading = {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 'bold' as const,
    marginTop: '0',
    borderBottom: '2px solid #F5A623',
    paddingBottom: '10px',
    display: 'inline-block',
};

const text = {
    color: '#e0e0e0',
    fontSize: '15px',
    lineHeight: '24px',
};

const infoBox = {
    backgroundColor: '#151515',
    borderLeft: '4px solid #F5A623',
    padding: '15px',
    margin: '20px 0',
};

const infoText = {
    color: '#ffffff',
    fontSize: '14px',
    margin: '0',
    lineHeight: '22px',
};

const linkContainer = {
    marginTop: '20px',
};

const quickLink = {
    color: '#F5A623',
    textDecoration: 'underline',
    marginRight: '20px',
    fontWeight: 'bold' as const,
    fontSize: '14px',
};

const hr = {
    borderColor: '#333',
    margin: '30px 0 20px 0',
};

const footer = {
    color: '#666',
    fontSize: '12px',
    textAlign: 'center' as const,
};

export default ContactAutoReply;
