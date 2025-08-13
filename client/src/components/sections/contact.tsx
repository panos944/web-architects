import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { insertContactSchema, type InsertContact } from '@shared/schema';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';

const features = [
  {
    title: 'Lightning Fast Delivery',
    description: 'Most projects completed within 2-4 weeks',
  },
  {
    title: '100% Custom Design',
    description: 'No templates, every design is unique to your brand',
  },
  {
    title: 'Ongoing Support',
    description: 'Free maintenance and updates for 3 months',
  },
  {
    title: 'Performance Guaranteed',
    description: '90+ PageSpeed scores or we optimize for free',
  },
];

export function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: 'Message sent successfully!',
        description: 'We\'ll get back to you within 4 hours.',
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  const containerRef = useGSAP(() => {
    gsap.from('.contact-title', {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.contact-title',
        start: "top 80%"
      }
    });

    gsap.from('.contact-form', {
      duration: 1,
      x: -100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.contact-form',
        start: "top 80%"
      }
    });

    gsap.from('.contact-info', {
      duration: 1,
      x: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.contact-info',
        start: "top 80%"
      }
    });
  });

  return (
    <section id="contact" className="py-24 gradient-bg relative overflow-hidden" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-cream/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="contact-title text-4xl lg:text-6xl font-bold text-white mb-6">
            Let's Create Something 
            <span className="text-cream"> Amazing</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Ready to transform your digital presence? Let's discuss your project and see how we can bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="contact-form bg-white/10 glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Your Name"
                          className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-cream"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-cream"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/20 border-white/30 text-white focus:border-cream">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="design">Web Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="both">Design + Development</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell us about your project..."
                          rows={4}
                          className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-cream"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 custom-shadow"
                >
                  {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Info */}
          <div className="contact-info space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose Web Architects?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={feature.title} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-cream rounded-full flex-shrink-0 mt-1"></div>
                    <div>
                      <h4 className="text-white font-semibold">{feature.title}</h4>
                      <p className="text-white/70">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 glass-effect rounded-2xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Quick Response</h4>
              <p className="text-white/80 mb-4">
                Need a quick answer? We typically respond to all inquiries within 4 hours during business days.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="mailto:hello@webarchitects.com" 
                  className="text-cream hover:text-white transition-colors duration-300"
                >
                  hello@webarchitects.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
