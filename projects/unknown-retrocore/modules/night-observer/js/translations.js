/**
 * Night Observer — Module translations
 * Phase 3: pattern analysis, correlation, transmission, atmosphere
 */

export const nightObserverTranslations = {
  en: {
    // Header
    'observer.title':      'NIGHT OBSERVER',
    'observer.subline':    'REMOTE OBSERVATION NODE 07',

    // Status panel
    'observer.nodeStatus':       'NODE STATUS:',
    'observer.online':           'ONLINE',
    'observer.radarStatus':      'RADAR STATUS:',
    'observer.active':           'ACTIVE',
    'observer.confirmedLabel':   'CONFIRMED ANOMALIES:',
    'observer.sessionLabel':     'SESSION ID:',

    // Radar overlay
    'observer.scanning':         'SCANNING\u2026',
    'observer.anomalyDetected':  'CONTACT DETECTED',
    'observer.signalLost':       'SIGNAL LOST',

    // Analysis labels
    'observer.analysis.signalType':     'SIGNAL TYPE:',
    'observer.analysis.trajectory':     'TRAJECTORY:',
    'observer.analysis.signalStrength': 'SIGNAL STRENGTH:',
    'observer.analysis.movement':       'MOVEMENT:',

    // Analysis — TRUE
    'analysis.sig.unknown':      'UNKNOWN',
    'analysis.sig.anomalous':    'ANOMALOUS',
    'analysis.sig.unclassified':  'UNCLASSIFIED',
    'analysis.sig.nonstandard':  'NON-STANDARD',
    'analysis.sig.repeated':     'REPEATED',
    'analysis.traj.irregular':       'IRREGULAR',
    'analysis.traj.nonlinear':       'NON-LINEAR',
    'analysis.traj.impossible':      'IMPOSSIBLE',
    'analysis.traj.orbital_anomaly': 'ORBITAL ANOMALY',
    'analysis.str.unstable':    'UNSTABLE',
    'analysis.str.fluctuating': 'FLUCTUATING',
    'analysis.str.erratic':     'ERRATIC',
    'analysis.str.anomalous':   'ANOMALOUS',
    'analysis.mov.unpredictable': 'UNPREDICTABLE',
    'analysis.mov.nonnewtonian':  'NON-NEWTONIAN',
    'analysis.mov.abrupt':        'ABRUPT CHANGES',
    'analysis.mov.reversal':      'REVERSAL DETECTED',

    // Analysis — FALSE
    'analysis.sig.known':       'KNOWN',
    'analysis.sig.civilian':    'CIVILIAN',
    'analysis.sig.atmospheric': 'ATMOSPHERIC',
    'analysis.sig.system':      'SYSTEM',
    'analysis.traj.linear':          'LINEAR',
    'analysis.traj.predictable':     'PREDICTABLE',
    'analysis.traj.regular':         'REGULAR',
    'analysis.traj.constant_bearing':'CONSTANT BEARING',
    'analysis.str.stable':     'STABLE',
    'analysis.str.consistent': 'CONSISTENT',
    'analysis.str.normal':     'NORMAL',
    'analysis.str.steady':     'STEADY',
    'analysis.mov.constant_vel': 'CONSTANT VELOCITY',
    'analysis.mov.steady':       'STEADY',
    'analysis.mov.linear':       'LINEAR',
    'analysis.mov.predictable':  'PREDICTABLE',

    // Actions
    'observer.confirm':  'CONFIRM ANOMALY',
    'observer.dismiss':  'DISMISS CONTACT',

    // Feedback
    'observer.feedback.confirmed':     'ANOMALY CONFIRMED',
    'observer.feedback.falsePositive': 'FALSE POSITIVE',
    'observer.feedback.missed':        'MISSED ANOMALY',
    'observer.feedback.dismissed':     'CONTACT DISMISSED',

    // Milestones
    'observer.milestone.2': 'UNUSUAL PATTERN DETECTED',
    'observer.milestone.4': 'SIGNAL CORRELATION FOUND',
    'observer.milestone.7': 'TRANSMISSION READY',

    // Pattern analysis sequence
    'observer.log.patternActive':      'PATTERN ANALYSIS ACTIVE',
    'observer.log.comparingContacts':  'Comparing recorded contacts\u2026',
    'observer.log.correlationScore':   'Correlation score: ',

    // Signal correlation sequence
    'observer.log.repeatedSignature':    'Repeated movement signature detected.',
    'observer.log.comparingTrajectories':'Comparing historical trajectories\u2026',
    'observer.log.matchConfidence':      'Match confidence: ',

    // Correlated anomaly
    'observer.log.correlated': 'Previous contact similarity detected.',

    // Transmission sequence
    'observer.log.assemblingFragments':   'Assembling transmission fragments\u2026',
    'observer.log.fragment01':           'Fragment 01 recovered.',
    'observer.log.fragment02':           'Fragment 02 recovered.',
    'observer.log.transmissionIntegrity': 'Transmission integrity: ',
    'observer.log.outsideSignalAvailable':'OUTSIDE SIGNAL AVAILABLE',

    // Atmospheric log entries
    'observer.atm.passiveScan':       'Passive scan complete.',
    'observer.atm.noiseIncreasing':   'Background noise increasing.',
    'observer.atm.signalFluctuation': 'Signal fluctuation detected.',
    'observer.atm.carrierWave':       'Unknown carrier wave present.',
    'observer.atm.archiveFailed':     'Archive lookup failed.',
    'observer.atm.noOperatorResponse':'No operator response.',
    'observer.atm.frequencyDrift':    'Frequency drift detected.',

    // Mystery log entries
    'observer.mystery.trajectoryResembles': 'Trajectory resembles previous event.',
    'observer.mystery.patternRecurrence':   'Pattern recurrence detected.',
    'observer.mystery.signatureMatch':      'Contact signature partially matches archive records.',
    'observer.mystery.originUnresolved':    'Origin unresolved.',

    // Log
    'observer.logTitle': 'OBSERVATION LOG',
    'observer.noEntries': 'Awaiting events\u2026',
    'observer.log.confirmed':     'Anomalous contact confirmed and recorded.',
    'observer.log.falsePositive': 'False positive \u2014 contact reclassified.',
    'observer.log.missed':        'Anomalous contact dismissed \u2014 flagged for review.',
    'observer.log.correctDismiss':'Non-anomalous contact dismissed.',

    // Footer
    'observer.back': 'RETURN TO UNKNOWN_SECTOR',

    // Lang
    'lang.en': 'EN',
    'lang.ua': 'UA',

        // Audio
    'observer.audio.title':   'AUDIO SYSTEM',
    'observer.audio.status':  'AUDIO STATUS:',
    'observer.audio.online':  'ONLINE',
    'observer.audio.muted':   'MUTED',
    'observer.audio.mute':    'MUTE',
    'observer.audio.unmute':  'UNMUTE',
    'observer.audio.active':  'AUDIO ACTIVE',
  },

  ua: {
    'observer.title':      '\u041D\u0406\u0427\u041D\u0418\u0419 \u0421\u041F\u041E\u0421\u0422\u0415\u0420\u0406\u0413\u0410\u0427',
    'observer.subline':    '\u0412\u0423\u0417\u041E\u041B \u0414\u0418\u0421\u0422\u0410\u041D\u0426\u0406\u0419\u041D\u041E\u0413\u041E \u0421\u041F\u041E\u0421\u0422\u0415\u0420\u0415\u0416\u0415\u041D\u041D\u042F 07',

    'observer.nodeStatus':       '\u0421\u0422\u0410\u0422\u0423\u0421 \u0412\u0423\u0417\u041B\u0410:',
    'observer.online':           '\u041E\u041D\u041B\u0410\u0419\u041D',
    'observer.radarStatus':      '\u0421\u0422\u0410\u0422\u0423\u0421 \u0420\u0410\u0414\u0410\u0420\u0410:',
    'observer.active':           '\u0410\u041A\u0422\u0418\u0412\u041D\u0418\u0419',
    'observer.confirmedLabel':   '\u041F\u0406\u0414\u0422\u0412\u0415\u0420\u0414\u0416\u0415\u041D\u0418\u0425 \u0410\u041D\u041E\u041C\u0410\u041B\u0406\u0419:',
    'observer.sessionLabel':     '\u0406\u0414\u0415\u041D\u0422\u0418\u0424\u0406\u041A\u0410\u0422\u041E\u0420 \u0421\u0415\u0421\u0406\u0406:',

    'observer.scanning':         '\u0421\u041A\u0410\u041D\u0423\u0412\u0410\u041D\u041D\u042F\u2026',
    'observer.anomalyDetected':  '\u041A\u041E\u041D\u0422\u0410\u041A\u0422 \u0412\u0418\u042F\u0412\u041B\u0415\u041D\u041E',
    'observer.signalLost':       '\u0421\u0418\u0413\u041D\u0410\u041B \u0412\u0422\u0420\u0410\u0427\u0415\u041D\u041E',

    'observer.analysis.signalType':     '\u0422\u0418\u041F \u0421\u0418\u0413\u041D\u0410\u041B\u0423:',
    'observer.analysis.trajectory':     '\u0422\u0420\u0410\u0404\u041A\u0422\u041E\u0420\u0406\u042F:',
    'observer.analysis.signalStrength': '\u041F\u041E\u0422\u0423\u0416\u041D\u0406\u0421\u0422\u042C \u0421\u0418\u0413\u041D\u0410\u041B\u0423:',
    'observer.analysis.movement':       '\u0420\u0423\u0425:',

    'analysis.sig.unknown':      '\u041D\u0415\u0412\u0406\u0414\u041E\u041C\u0418\u0419',
    'analysis.sig.anomalous':    '\u0410\u041D\u041E\u041C\u0410\u041B\u042C\u041D\u0418\u0419',
    'analysis.sig.unclassified':  '\u041D\u0415\u041A\u041B\u0410\u0421\u0418\u0424\u0406\u041A\u041E\u0412\u0410\u041D\u0418\u0419',
    'analysis.sig.nonstandard':  '\u041D\u0415\u0421\u0422\u0410\u041D\u0414\u0410\u0420\u0422\u041D\u0418\u0419',
    'analysis.sig.repeated':     '\u041F\u041E\u0412\u0422\u041E\u0420\u041D\u0418\u0419',
    'analysis.traj.irregular':       '\u041D\u0415\u0420\u0415\u0413\u0423\u041B\u042F\u0420\u041D\u0410',
    'analysis.traj.nonlinear':       '\u041D\u0415\u041B\u0406\u041D\u0406\u0419\u041D\u0410',
    'analysis.traj.impossible':      '\u041D\u0415\u041C\u041E\u0416\u041B\u0418\u0412\u0410',
    'analysis.traj.orbital_anomaly': '\u041E\u0420\u0411\u0406\u0422\u0410\u041B\u042C\u041D\u0410 \u0410\u041D\u041E\u041C\u0410\u041B\u0406\u042F',
    'analysis.str.unstable':    '\u041D\u0415\u0421\u0422\u0410\u0411\u0406\u041B\u042C\u041D\u0418\u0419',
    'analysis.str.fluctuating': '\u041F\u041E\u0425\u0418\u0422\u041B\u0418\u0412\u0418\u0419',
    'analysis.str.erratic':     '\u0425\u0410\u041E\u0422\u0418\u0427\u041D\u0418\u0419',
    'analysis.str.anomalous':   '\u0410\u041D\u041E\u041C\u0410\u041B\u042C\u041D\u0418\u0419',
    'analysis.mov.unpredictable': '\u041D\u0415\u041F\u0415\u0420\u0415\u0414\u0411\u0410\u0427\u0423\u0412\u0410\u041D\u0418\u0419',
    'analysis.mov.nonnewtonian':  '\u041D\u0415\u041D\u042C\u042E\u0422\u041E\u041D\u0406\u0412\u0421\u042C\u041A\u0418\u0419',
    'analysis.mov.abrupt':        '\u0420\u0415\u0417\u041A\u0406 \u0417\u041C\u0406\u041D\u0418',
    'analysis.mov.reversal':      '\u0412\u0418\u042F\u0412\u041B\u0415\u041D\u041E \u0420\u0415\u0412\u0415\u0420\u0421',

    'analysis.sig.known':       '\u0412\u0406\u0414\u041E\u041C\u0418\u0419',
    'analysis.sig.civilian':    '\u0426\u0418\u0412\u0406\u041B\u042C\u041D\u0418\u0419',
    'analysis.sig.atmospheric': '\u0410\u0422\u041C\u041E\u0421\u0424\u0415\u0420\u041D\u0418\u0419',
    'analysis.sig.system':      '\u0421\u0418\u0421\u0422\u0415\u041C\u041D\u0418\u0419',
    'analysis.traj.linear':          '\u041B\u0406\u041D\u0406\u0419\u041D\u0410',
    'analysis.traj.predictable':     '\u041F\u0415\u0420\u0415\u0414\u0411\u0410\u0427\u0423\u0412\u0410\u041D\u0410',
    'analysis.traj.regular':         '\u0420\u0415\u0413\u0423\u041B\u042F\u0420\u041D\u0410',
    'analysis.traj.constant_bearing':'\u0421\u0422\u0410\u041B\u0418\u0419 \u041F\u0415\u041B\u0415\u041D\u0413',
    'analysis.str.stable':     '\u0421\u0422\u0410\u0411\u0406\u041B\u042C\u041D\u0418\u0419',
    'analysis.str.consistent': '\u0421\u0422\u0406\u0419\u041A\u0418\u0419',
    'analysis.str.normal':     '\u041D\u041E\u0420\u041C\u0410\u041B\u042C\u041D\u0418\u0419',
    'analysis.str.steady':     '\u0420\u0406\u0412\u041D\u041E\u041C\u0406\u0420\u041D\u0418\u0419',
    'analysis.mov.constant_vel': '\u0421\u0422\u0410\u041B\u0410 \u0428\u0412\u0418\u0414\u041A\u0406\u0421\u0422\u042C',
    'analysis.mov.steady':       '\u0420\u0406\u0412\u041D\u041E\u041C\u0406\u0420\u041D\u0418\u0419',
    'analysis.mov.linear':       '\u041B\u0406\u041D\u0406\u0419\u041D\u0418\u0419',
    'analysis.mov.predictable':  '\u041F\u0415\u0420\u0415\u0414\u0411\u0410\u0427\u0423\u0412\u0410\u041D\u0418\u0419',

    'observer.confirm':  '\u041F\u0406\u0414\u0422\u0412\u0415\u0420\u0414\u0418\u0422\u0418 \u0410\u041D\u041E\u041C\u0410\u041B\u0406\u042E',
    'observer.dismiss':  '\u0412\u0406\u0414\u0425\u0418\u041B\u0418\u0422\u0418 \u041A\u041E\u041D\u0422\u0410\u041A\u0422',

    'observer.feedback.confirmed':     '\u0410\u041D\u041E\u041C\u0410\u041B\u0406\u042E \u041F\u0406\u0414\u0422\u0412\u0415\u0420\u0414\u0416\u0415\u041D\u041E',
    'observer.feedback.falsePositive': '\u0425\u0418\u0411\u041D\u0415 \u0421\u041F\u0420\u0410\u0426\u042E\u0412\u0410\u041D\u041D\u042F',
    'observer.feedback.missed':        '\u041F\u0420\u041E\u041F\u0423\u0429\u0415\u041D\u0410 \u0410\u041D\u041E\u041C\u0410\u041B\u0406\u042F',
    'observer.feedback.dismissed':     '\u041A\u041E\u041D\u0422\u0410\u041A\u0422 \u0412\u0406\u0414\u0425\u0418\u041B\u0415\u041D\u041E',

    'observer.milestone.2': '\u0412\u0418\u042F\u0412\u041B\u0415\u041D\u041E \u041D\u0415\u0422\u0418\u041F\u041E\u0412\u0423 \u041F\u0410\u0422\u0415\u0420\u041D',
    'observer.milestone.4': '\u0417\u041D\u0410\u0419\u0414\u0415\u041D\u041E \u041A\u041E\u0420\u0415\u041B\u042F\u0426\u0406\u042E \u0421\u0418\u0413\u041D\u0410\u041B\u0423',
    'observer.milestone.7': '\u041F\u0415\u0420\u0415\u0414\u0410\u0427\u0423 \u0413\u041E\u0422\u041E\u0412\u0410',

    'observer.log.patternActive':      '\u0410\u041D\u0410\u041B\u0406\u0417 \u041F\u0410\u0422\u0415\u0420\u041D\u0406\u0412 \u0410\u041A\u0422\u0418\u0412\u041D\u0418\u0419',
    'observer.log.comparingContacts':  '\u041F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u0445 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0456\u0432\u2026',
    'observer.log.correlationScore':   '\u0420\u0456\u0432\u0435\u043D\u044C \u043A\u043E\u0440\u0435\u043B\u044F\u0446\u0456\u0457: ',

    'observer.log.repeatedSignature':    '\u0412\u0438\u044F\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u0443 \u0441\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u0443 \u0440\u0443\u0445\u0443.',
    'observer.log.comparingTrajectories':'\u041F\u043E\u0440\u0456\u0432\u043D\u044F\u043D\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0438\u0447\u043D\u0438\u0445 \u0442\u0440\u0430\u0454\u043A\u0442\u043E\u0440\u0456\u0439\u2026',
    'observer.log.matchConfidence':      '\u041D\u0430\u0434\u0456\u0439\u043D\u0456\u0441\u0442\u044C \u0437\u0431\u0456\u0433\u0443: ',

    'observer.log.correlated': '\u0412\u0438\u044F\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u0434\u0456\u0431\u043D\u0456\u0441\u0442\u044C \u0437 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u043C \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043E\u043C.',

    'observer.log.assemblingFragments':   '\u0417\u0431\u0438\u0440\u0430\u043D\u043D\u044F \u0444\u0440\u0430\u0433\u043C\u0435\u043D\u0442\u0456\u0432 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0456\u2026',
    'observer.log.fragment01':           '\u0424\u0440\u0430\u0433\u043C\u0435\u043D\u0442 01 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043E.',
    'observer.log.fragment02':           '\u0424\u0440\u0430\u0433\u043C\u0435\u043D\u0442 02 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043E.',
    'observer.log.transmissionIntegrity': '\u0426\u0456\u043B\u0456\u0441\u043D\u0456\u0441\u0442\u044C \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0456: ',
    'observer.log.outsideSignalAvailable':'\u0417\u041E\u0412\u041D\u0406\u0428\u041D\u0406\u0419 \u0421\u0418\u0413\u041D\u0410\u041B \u0414\u041E\u0421\u0422\u0423\u041F\u041D\u0418\u0419',

    'observer.atm.passiveScan':       '\u041F\u0430\u0441\u0438\u0432\u043D\u0435 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E.',
    'observer.atm.noiseIncreasing':   '\u0424\u043E\u043D\u043E\u0432\u0438\u0439 \u0448\u0443\u043C \u0437\u0440\u043E\u0441\u0442\u0430\u0454.',
    'observer.atm.signalFluctuation': '\u0412\u0438\u044F\u0432\u043B\u0435\u043D\u043E \u0444\u043B\u0443\u043A\u0442\u0443\u0430\u0446\u0456\u044E \u0441\u0438\u0433\u043D\u0430\u043B\u0443.',
    'observer.atm.carrierWave':       '\u041F\u0440\u0438\u0441\u0443\u0442\u043D\u044F \u043D\u0435\u0432\u0456\u0434\u043E\u043C\u0430 \u043D\u0435\u0441\u0443\u0447\u0430 \u0445\u0432\u0438\u043B\u044F.',
    'observer.atm.archiveFailed':     '\u041F\u043E\u0448\u0443\u043A \u0432 \u0430\u0440\u0445\u0456\u0432\u0456 \u043D\u0435\u0432\u0434\u0430\u043B\u0438\u0439.',
    'observer.atm.noOperatorResponse':'\u041D\u0435\u043C\u0430\u0454 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u0430.',
    'observer.atm.frequencyDrift':    '\u0412\u0438\u044F\u0432\u043B\u0435\u043D\u043E \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043D\u044F \u0447\u0430\u0441\u0442\u043E\u0442\u0438.',

    'observer.mystery.trajectoryResembles': '\u0422\u0440\u0430\u0454\u043A\u0442\u043E\u0440\u0456\u044F \u043F\u043E\u0434\u0456\u0431\u043D\u0430 \u0434\u043E \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u0457 \u043F\u043E\u0434\u0456\u0457.',
    'observer.mystery.patternRecurrence':   '\u0412\u0438\u044F\u0432\u043B\u0435\u043D\u043E \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u043D\u044F \u043F\u0430\u0442\u0435\u0440\u043D\u0443.',
    'observer.mystery.signatureMatch':      '\u0421\u0438\u0433\u043D\u0430\u0442\u0443\u0440\u0430 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0443 \u0447\u0430\u0441\u0442\u043A\u043E\u0432\u043E \u0437\u0431\u0456\u0433\u0430\u0454 \u0437 \u0430\u0440\u0445\u0456\u0432\u043D\u0438\u043C\u0438 \u0437\u0430\u043F\u0438\u0441\u0430\u043C\u0438.',
    'observer.mystery.originUnresolved':    '\u041F\u043E\u0445\u043E\u0434\u0436\u0435\u043D\u043D\u044F \u043D\u0435 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E.',

    'observer.logTitle': '\u0416\u0423\u0420\u041D\u0410\u041B \u0421\u041F\u041E\u0421\u0422\u0415\u0420\u0415\u0416\u0415\u041D\u042C',
    'observer.noEntries': '\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u043E\u0434\u0456\u0439\u2026',
    'observer.log.confirmed':     '\u0410\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043E \u0442\u0430 \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u043E.',
    'observer.log.falsePositive': '\u0425\u0438\u0431\u043D\u0435 \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F \u2014 \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u043F\u0435\u0440\u0435\u043A\u043B\u0430\u0441\u0438\u0444\u0456\u043A\u043E\u0432\u0430\u043D\u043E.',
    'observer.log.missed':        '\u0410\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043E \u2014 \u043F\u043E\u0437\u043D\u0430\u0447\u0435\u043D\u043E \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434\u0443.',
    'observer.log.correctDismiss':'\u041D\u0435\u0430\u043D\u043E\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043E.',

    'observer.back': '\u041F\u041E\u0412\u0415\u0420\u041D\u0423\u0422\u0418\u0421\u042F \u0414\u041E UNKNOWN_SECTOR',

    'lang.en': 'EN',
    'lang.ua': 'UA',
        // Audio
    'observer.audio.title':   '\u0410\u0423\u0414\u0406\u041E \u0421\u0418\u0421\u0422\u0415\u041C\u0410',
    'observer.audio.status':  '\u0421\u0422\u0410\u0422\u0423\u0421 \u0410\u0423\u0414\u0406\u041E:',
    'observer.audio.online':  '\u041E\u041D\u041B\u0410\u0419\u041D',
    'observer.audio.muted':   '\u0412\u0418\u041C\u041A\u041D\u0415\u041D\u041E',
    'observer.audio.mute':    '\u0412\u0418\u041C\u041A\u041D.',
    'observer.audio.unmute':  '\u0423\u0412\u0406\u041C\u041A\u041D.',
    'observer.audio.active':  '\u0410\u0423\u0414\u0406\u041E \u0410\u041A\u0422\u0418\u0412\u041D\u0415',
  }
};