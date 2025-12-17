import Navigation from '@/components/Navigation';
import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Book, Clock, Code } from 'lucide-react';
import Link from 'next/link';

const endpoints = [
  { method: 'GET', path: '/api/v1/signals', description: 'Retrieve signals with optional filters' },
  { method: 'GET', path: '/api/v1/signals/:id', description: 'Get a specific signal by ID' },
  { method: 'POST', path: '/api/v1/leads', description: 'Create a new lead from a signal' },
  { method: 'GET', path: '/api/v1/leads', description: 'List all leads with pagination' },
  { method: 'PUT', path: '/api/v1/leads/:id', description: 'Update lead information' },
  { method: 'GET', path: '/api/v1/analytics', description: 'Get signal and conversion analytics' },
];

const articles = [
  {
    title: 'Getting Your API Key',
    readTime: '2 min',
    content:
      "API access is available on Professional and Enterprise plans. Go to Settings > API > Generate New Key. Store your key securely—it won't be shown again. Use environment variables to manage keys in your applications.",
  },
  {
    title: 'Authentication',
    readTime: '2 min',
    content:
      "All API requests require authentication via Bearer token. Include your API key in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. Keys have full account access, so treat them like passwords.",
  },
  {
    title: 'Rate Limits',
    readTime: '2 min',
    content:
      "API rate limits are 100 requests/minute for Professional plans and 500 requests/minute for Enterprise. Rate limit headers are included in all responses. If you exceed limits, you'll receive a 429 response.",
  },
  {
    title: 'Pagination',
    readTime: '2 min',
    content: "List endpoints support pagination with 'page' and 'limit' query parameters. Default limit is 25, maximum is 100. Response includes 'total', 'page', and 'pages' for navigation.",
  },
  {
    title: 'Filtering and Sorting',
    readTime: '3 min',
    content: "Use query parameters to filter results. Common filters: signal_type, score_min, score_max, date_from, date_to, location. Sort with 'sort_by' and 'order' (asc/desc) parameters.",
  },
  {
    title: 'Webhooks',
    readTime: '3 min',
    content:
      'Configure webhooks in Settings > API > Webhooks to receive real-time notifications. Events include: signal.created, lead.created, lead.updated. Webhooks use HMAC-SHA256 for signature verification.',
  },
  {
    title: 'Error Handling',
    readTime: '2 min',
    content:
      "API errors return standard HTTP status codes with JSON error bodies. Common codes: 400 (bad request), 401 (unauthorized), 404 (not found), 429 (rate limit), 500 (server error). Error responses include 'message' and 'code' fields.",
  },
  {
    title: 'SDK Libraries',
    readTime: '2 min',
    content:
      'Official SDKs are available for Python, Node.js, and PHP. Install via pip/npm/composer. SDKs handle authentication, pagination, and error handling automatically. Community SDKs available for Ruby and Go.',
  },
];

const codeExample = `// Node.js Example\nconst axios = require('axios');\n\nconst URI_API_KEY = process.env.URI_API_KEY;\n\nasync function getHighIntentSignals() {\n  const response = await axios.get('https://api.uri.africa/v1/signals', {\n    headers: {\n      Authorization: \`Bearer \${URI_API_KEY}\`,\n    },\n    params: {\n      score_min: 70,\n      limit: 10,\n      sort_by: 'score',\n      order: 'desc',\n    },\n  });\n\n  return response.data.signals;\n}`;

export default function APIHelpPage() {
  return (
    <>
      <SeoHead title="Help Center – API & Technical" />
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/resources/help-center" className="inline-flex items-center text-primary hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Help Center
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">11 Articles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              API & <span className="text-primary">Technical</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Technical documentation for developers building integrations with URI.</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="rounded-full">
                <Book className="w-4 h-4 mr-2" /> Full API Docs
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                <Code className="w-4 h-4 mr-2" /> View SDKs
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Method</th>
                    <th className="text-left p-4 font-medium">Endpoint</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((endpoint, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            endpoint.method === 'GET' ? 'bg-green-500/10 text-green-500' : endpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm">{endpoint.path}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{endpoint.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Start Example</h2>
            <div className="bg-card border border-border rounded-xl p-6">
              <pre className="text-sm text-muted-foreground overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
            <h2 className="text-2xl font-bold">Technical Articles</h2>
            {articles.map((article) => (
              <div key={article.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" /> {article.readTime}
                  </span>
                </div>
                <p className="text-muted-foreground">{article.content}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12">
            <Link href="/resources/help-center/security" className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group block">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Previous: Security & Privacy</h3>
              <p className="text-sm text-muted-foreground mb-4">Learn how we protect your data.</p>
              <span className="text-primary text-sm flex items-center">
                Read articles <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
