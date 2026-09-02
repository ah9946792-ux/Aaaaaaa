import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, CircleDot, Award, ArrowRight } from 'lucide-react';

interface TossAnimationPanelProps {
  teamAName: string;
  teamBName: string;
  isUserTeamA: boolean;
  onTossCompleted: (winner: 'teamA' | 'teamB', decision: 'BAT' | 'BOWL') => void;
}

export const TossAnimationPanel: React.FC<TossAnimationPanelProps> = ({
  teamAName,
  teamBName,
  isUserTeamA,
  onTossCompleted,
}) => {
  const [selectedCall, setSelectedCall] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [isFlipping, setIsFlipping] = useState(false);
  const [tossResult, setTossResult] = useState<{
    coinLand: 'HEADS' | 'TAILS';
    winner: 'teamA' | 'teamB';
  } | null>(null);

  const [selectedDecision, setSelectedDecision] = useState<'BAT' | 'BOWL' | null>(null);

  const handleFlipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const coinLand: 'HEADS' | 'TAILS' = Math.random() > 0.5 ? 'HEADS' : 'HEADS';
      const userWon = Math.random() > 0.45;
      const winner = userWon ? (isUserTeamA ? 'teamA' : 'teamB') : isUserTeamA ? 'teamB' : 'teamA';

      setTossResult({ coinLand, winner });
      setIsFlipping(false);

      // If AI won toss, decide automatically
      if ((winner === 'teamA' && !isUserTeamA) || (winner === 'teamB' && isUserTeamA)) {
        const aiDecision: 'BAT' | 'BOWL' = Math.random() > 0.5 ? 'BAT' : 'BOWL';
        setSelectedDecision(aiDecision);
      }
    }, 1800);
  };

  const handleConfirmStart = () => {
    if (tossResult && selectedDecision) {
      onTossCompleted(tossResult.winner, selectedDecision);
    }
  };

  const winnerName = tossResult?.winner === 'teamA' ? teamAName : teamBName;
  const isUserWinner = (tossResult?.winner === 'teamA' && isUserTeamA) || (tossResult?.winner === 'teamB' && !isUserTeamA);

  return (
    <div
      id="toss-animation-panel"
      className="max-w-2xl mx-auto rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#0b1021] via-[#111936] to-[#060914] p-6 sm:p-8 text-white shadow-2xl space-y-6"
    >
      <div className="text-center space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
          OFFICIAL MATCH PREPARATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          THE OFFICIAL COIN TOSS
        </h2>
        <p className="text-xs text-slate-300">
          Captains {teamAName} and {teamBName} meet in the middle with the match referee.
        </p>
      </div>

      {/* 3D Coin Visualization */}
      <div className="py-6 flex flex-col items-center justify-center">
        <motion.div
          animate={isFlipping ? { rotateY: [0, 720, 1440, 2160], y: [-20, -100, 0] } : { rotateY: 0, y: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="h-28 w-28 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center text-slate-950 font-black text-2xl font-mono select-none"
        >
          {isFlipping ? '🏏' : tossResult ? tossResult.coinLand : selectedCall}
        </motion.div>

        <div className="mt-4 text-xs font-bold text-slate-400">
          {isFlipping ? 'COIN IN THE AIR...' : tossResult ? `COIN LANDED: ${tossResult.coinLand}` : 'CALL IN THE AIR'}
        </div>
      </div>

      {/* Step 1: Call Heads or Tails */}
      {!tossResult && (
        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            <button
              disabled={isFlipping}
              onClick={() => setSelectedCall('HEADS')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                selectedCall === 'HEADS'
                  ? 'border-2 border-amber-400 bg-amber-500/20 text-amber-300 shadow-md'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              CALL HEADS
            </button>

            <button
              disabled={isFlipping}
              onClick={() => setSelectedCall('TAILS')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                selectedCall === 'TAILS'
                  ? 'border-2 border-amber-400 bg-amber-500/20 text-amber-300 shadow-md'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              CALL TAILS
            </button>
          </div>

          <button
            onClick={handleFlipCoin}
            disabled={isFlipping}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl transition-all active:scale-[0.99] disabled:opacity-50"
          >
            SPIN THE COIN
          </button>
        </div>
      )}

      {/* Step 2: Toss Outcome & Decision */}
      {tossResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 rounded-2xl border border-white/10 bg-black/40 p-5 text-center"
        >
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">TOSS RESULT</div>
            <div className="text-xl font-black text-amber-400 mt-1">
              {winnerName} WON THE TOSS!
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isUserWinner ? 'You have won the toss. Choose your strategy:' : `${winnerName} has won the toss.`}
            </p>
          </div>

          {/* If user won toss, allow Bat / Bowl selection */}
          {isUserWinner ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedDecision('BAT')}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedDecision === 'BAT'
                    ? 'border-2 border-emerald-400 bg-emerald-950/60 text-emerald-200'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-white'
                }`}
              >
                <div className="text-sm font-black uppercase">BAT FIRST</div>
                <div className="text-[11px] text-slate-300 mt-1">Set a commanding 1st innings target</div>
              </button>

              <button
                onClick={() => setSelectedDecision('BOWL')}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedDecision === 'BOWL'
                    ? 'border-2 border-blue-400 bg-blue-950/60 text-blue-200'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-white'
                }`}
              >
                <div className="text-sm font-black uppercase">BOWL FIRST</div>
                <div className="text-[11px] text-slate-300 mt-1">Exploit fresh pitch conditions & chase</div>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200">
              Opponent captain elected to <strong className="text-amber-400 uppercase">{selectedDecision === 'BAT' ? 'Bat First' : 'Bowl First'}</strong>.
            </div>
          )}

          <button
            disabled={!selectedDecision}
            onClick={handleConfirmStart}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all"
          >
            <span>TAKE THE FIELD & START MATCH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
