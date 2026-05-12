import Subscriber from '../models/Subscriber.js';
import Product from '../models/Product.js';
import { sendNewsletter } from '../config/mailer.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalized = email.toLowerCase().trim();

    let subscriber = await Subscriber.findOne({ email: normalized });
    if (!subscriber) {
      subscriber = await Subscriber.create({ email: normalized });
    }

    // Fetch latest 5 products (by createdAt) including sale flags
    const latestProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Send newsletter email asynchronously (don't block response long)
    try {
      const sendPromise = sendNewsletter(normalized, latestProducts);
      if (sendPromise && typeof sendPromise.then === 'function') {
        sendPromise.catch((err) => console.error('Newsletter send failed:', err));
      }
    } catch (err) {
      console.error('Newsletter send failed (sync):', err);
    }

    return res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ message: 'Failed to subscribe' });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalized = email.toLowerCase().trim();
    const removed = await Subscriber.findOneAndDelete({ email: normalized });

    if (!removed) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    return res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({ message: 'Failed to unsubscribe' });
  }
};

export const listSubscribers = async (req, res) => {
  try {
    const subs = await Subscriber.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ subscribers: subs });
  } catch (error) {
    console.error('List subscribers error:', error);
    return res.status(500).json({ message: 'Failed to list subscribers' });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Subscriber id required' });

    const removed = await Subscriber.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Subscriber not found' });

    return res.status(200).json({ message: 'Subscriber removed' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return res.status(500).json({ message: 'Failed to delete subscriber' });
  }
};
