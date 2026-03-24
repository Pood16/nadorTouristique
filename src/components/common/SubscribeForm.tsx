import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addSubscriber } from '@/store/slices/subscribersSlice';
import { cn } from '@/utils/cn';

interface SubscribeFormProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function SubscribeForm({ variant = 'light', className }: SubscribeFormProps) {
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;
    setLoading(true);
    try {
      await dispatch(addSubscriber({ email, firstName })).unwrap();
      setDone(true);
      toast.success('Inscription réussie ! Bienvenue 🎉');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-3 py-8 px-6 rounded-2xl text-center',
          variant === 'light' ? 'bg-accent-100 text-accent-700' : 'bg-white/10 text-white',
          className
        )}
      >
        <span className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </span>
        <p className="font-semibold text-lg">Vous êtes inscrit(e) !</p>
        <p className="text-sm opacity-80">Vous recevrez bientôt nos actualités.</p>
      </div>
    );
  }

  return (
    <form
      id="newsletter"
      onSubmit={handleSubmit}
      className={cn(
        'rounded-2xl p-6 flex flex-col gap-4',
        variant === 'light'
          ? 'bg-white shadow-md border border-neutral-200'
          : 'bg-white/10 backdrop-blur-sm border border-white/20',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center',
            variant === 'light' ? 'bg-primary-100' : 'bg-white/20'
          )}
        >
          <Mail className={cn('w-5 h-5', variant === 'light' ? 'text-primary-700' : 'text-white')} />
        </span>
        <div>
          <h3
            className={cn(
              'font-semibold text-base leading-tight',
              variant === 'light' ? 'text-neutral-950' : 'text-white'
            )}
          >
            Newsletter
          </h3>
          <p className={cn('text-xs', variant === 'light' ? 'text-neutral-500' : 'text-white/70')}>
            Restez informé des événements à Nador
          </p>
        </div>
      </div>

      {variant === 'light' ? (
        <>
          <Input
            placeholder="Votre prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <Input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </>
      ) : (
        <>
          <input
            placeholder="Votre prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
            className="px-4 py-2.5 rounded-lg border-0 bg-white/90 text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="px-4 py-2.5 rounded-lg border-0 bg-white/90 text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
        </>
      )}

      <Button
        type="submit"
        variant={variant === 'light' ? 'primary' : 'secondary'}
        loading={loading}
        className="w-full"
      >
        S&apos;abonner gratuitement
      </Button>
    </form>
  );
}
