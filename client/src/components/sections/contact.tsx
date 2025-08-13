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
        description: 'We\'ll get back to you within 24 hours.',
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
      duration: 1.5,
      y: 60,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.contact-title',
        start: "top 85%"
      }
    });

    gsap.from('.contact-form', {
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.contact-form',
        start: "top 75%"
      }
    });

    // Parallax effect for background image
    gsap.to('.contact-bg-image', {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  return (
    <section id="contact" className="section-padding relative overflow-hidden" ref={containerRef}>
      {/* Background image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1333"
          alt="Modern architectural interior"
          className="contact-bg-image w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95"></div>
      </div>
      <div className="container-fluid relative z-10">
        
        {/* Title */}
        <div className="contact-title text-center mb-24">
          <div className="space-y-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight mb-8">
              <span className="text-muted-foreground">Let's</span>
              <br />
              <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ready to bring your digital vision to life? 
              We'd love to hear about your project.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="contact-form max-w-2xl mx-auto">
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-light tracking-wide text-muted-foreground uppercase">Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Your name"
                            className="bg-transparent border-0 border-b border-border/30 rounded-none px-0 py-4 text-lg font-light placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-primary"
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
                        <FormLabel className="text-sm font-light tracking-wide text-muted-foreground uppercase">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            placeholder="your@email.com"
                            className="bg-transparent border-0 border-b border-border/30 rounded-none px-0 py-4 text-lg font-light placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-light tracking-wide text-muted-foreground uppercase">Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none px-0 py-4 text-lg font-light focus:ring-0 focus:border-primary">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="strategy">Digital Strategy</SelectItem>
                          <SelectItem value="design">Interface Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="complete">Complete Project</SelectItem>
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
                      <FormLabel className="text-sm font-light tracking-wide text-muted-foreground uppercase">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell us about your project and vision..."
                          rows={4}
                          className="bg-transparent border-0 border-b border-border/30 rounded-none px-0 py-4 text-lg font-light placeholder:text-muted-foreground/50 resize-none focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-8">
                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="glass-effect hover:bg-foreground/10 text-foreground border-0 px-12 py-6 text-lg font-light tracking-wide transition-all duration-500 hover:scale-105"
                  >
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>

              </form>
            </Form>
          </div>
        </div>

      </div>
    </section>
  );
}
