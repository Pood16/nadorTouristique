import { useEffect, useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchSubscribers } from '@/store/slices/subscribersSlice';
import newsletterService from '@/services/newsletterService';
import Button from '@/components/common/Button';

type SendState = 'idle' | 'sending' | 'done' | 'error';

export default function NewsletterPage() {
  const dispatch = useAppDispatch();
  const { items: subscribers } = useAppSelector((s) => s.subscribers);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendState, setSendState] = useState<SendState>('idle');
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0 });

  useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch]);

  const activeSubscribers = subscribers.filter((s) => s.status === 'active');

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSendState('sending');
    setProgress({ sent: 0, failed: 0, total: activeSubscribers.length });

    let sent = 0;
    let failed = 0;

    for (const sub of activeSubscribers) {
      try {
        await newsletterService.sendToOne({ toEmail: sub.email, toName: sub.firstName, subject, body });
        sent++;
      } catch {
        failed++;
      }
      setProgress((p) => ({ ...p, sent, failed }));
    }

    setSendState(failed > 0 && sent === 0 ? 'error' : 'done');
  };

  const reset = () => {
    setSendState('idle');
    setProgress({ sent: 0, failed: 0, total: 0 });
    setSubject('');
    setBody('');
  };

  const isSending = sendState === 'sending';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Mail className="w-6 h-6 text-primary-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-neutral-950">Envoyer une Newsletter</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {activeSubscribers.length} abonné{activeSubscribers.length !== 1 ? 's' : ''} actif{activeSubscribers.length !== 1 ? 's' : ''} recevra{activeSubscribers.length !== 1 ? 'nt' : ''} cet email.
          </p>
        </div>
      </div>

      {sendState === 'done' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Envoi terminé !</p>
            <p className="text-sm text-green-700 mt-1">
              {progress.sent} email{progress.sent !== 1 ? 's' : ''} envoyé{progress.sent !== 1 ? 's' : ''} avec succès.
              {progress.failed > 0 && ` ${progress.failed} échec${progress.failed !== 1 ? 's' : ''}.`}
            </p>
            <button onClick={reset} className="mt-3 text-sm font-medium text-green-700 underline hover:text-green-900">
              Rédiger un nouvel email
            </button>
          </div>
        </div>
      )}

      {sendState === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-red-800">Tous les envois ont échoué.</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez la configuration EmailJS dans votre fichier .env.</p>
            <button onClick={() => setSendState('idle')} className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900">
              Réessayer
            </button>
          </div>
        </div>
      )}

      {sendState !== 'done' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Sujet *</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
              className="input"
              placeholder="Ex: Découvrez les nouveautés de Nador !"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Corps du message *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isSending}
              rows={10}
              className="input resize-none"
              placeholder="Rédigez votre message ici…"
            />
          </div>

          {isSending && (
            <div>
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>Envoi en cours…</span>
                <span>{progress.sent + progress.failed} / {progress.total}</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.total ? Math.round(((progress.sent + progress.failed) / progress.total) * 100) : 0}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {activeSubscribers.length === 0 && (
              <p className="text-sm text-amber-600 text-right mr-auto">Aucun abonné actif pour le moment.</p>
            )}
            <Button
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handleSend}
              isLoading={isSending}
              disabled={isSending || !subject.trim() || !body.trim() || activeSubscribers.length === 0}
            >
              {isSending ? 'Envoi en cours…' : `Envoyer à ${activeSubscribers.length} abonné${activeSubscribers.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
