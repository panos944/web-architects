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
import { ConnectedDots } from '@/components/ui/connected-dots';

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
    <section id="contact" className="py-24 bg-card relative overflow-hidden z-10" ref={containerRef}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-40" dotCount={25} connectionDistance={160} />
      {/* Minimal background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-primary/10 to-transparent"></div>
      </div>
      <div className="container-fluid relative z-10">
        
        {/* Title with experimental layout */}
        <div className="contact-title mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-6">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">03</div>
                <div className="space-y-2">
                  <div className="text-[clamp(2.5rem,5vw,6rem)] font-extralight leading-[0.9] tracking-tight text-foreground">
                    LET'S
                  </div>
                  <div className="text-[clamp(2.5rem,5vw,6rem)] font-light leading-[0.9] tracking-tight text-gradient ml-12 -mt-4">
                    CONNECT
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6">
              <div className="max-w-lg space-y-6">
                <p className="text-base font-light text-foreground/70 leading-relaxed">
                  Ready to explore new possibilities? We'd love to hear about your project and discuss how we can bring your vision to life.
                </p>
                <div className="w-24 h-px bg-primary/40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="contact-form max-w-3xl">
          <div className="bg-white/95 backdrop-blur-sm border border-border/20 shadow-lg rounded-2xl p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-light tracking-wide text-foreground/60 uppercase">Name</FormLabel>
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
                        <FormLabel className="text-sm font-light tracking-wide text-foreground/60 uppercase">Email</FormLabel>
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
                      <FormLabel className="text-sm font-light tracking-wide text-foreground/60 uppercase">Project Type</FormLabel>
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
                      <FormLabel className="text-sm font-light tracking-wide text-foreground/60 uppercase">Message</FormLabel>
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
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white border-0 px-12 py-6 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 shadow-lg"
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
