// 📁 utils/tarification.js

exports.calculatePrice = (distanceKm, role, heureCourse) => {
    const basePrice = 2;
    const nightSurcharge = 0.30;
  
    let pricePerKm;
    let commissionRate;
  
    if (role === 'vtc') {
      pricePerKm = 1.50 * 0.98;
      commissionRate = 0.15;
    } else if (role === 'covoiturage') {
      pricePerKm = 0.90;
      commissionRate = 0.10;
    } else {
      throw new Error('Rôle utilisateur non reconnu');
    }
  
    let price = basePrice + (distanceKm * pricePerKm);
  
    const heure = parseInt(heureCourse.split(':')[0], 10);
    const isNight = heure >= 22 || heure < 6;
    if (isNight) price += nightSurcharge;
  
    const commission = price * commissionRate;
    const revenue = price - commission;
  
    return {
      total: Number(price.toFixed(2)),
      commission: Number(commission.toFixed(2)),
      revenue: Number(revenue.toFixed(2)),
      isNight
    };
  };
  