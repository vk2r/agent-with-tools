"use client";

import { MousePointerClick } from "lucide-react";

import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const transition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
};

const getCardVariants = (i: number) => ({
  collapsed: {
    marginTop: i === 0 ? 0 : -44,
    scaleX: 1 - i * 0.05,
  },
  expanded: {
    marginTop: i === 0 ? 0 : 4,
    scaleX: 1,
  },
});

const textSwitchTransition: Transition = {
  duration: 0.22,
  ease: "easeInOut",
};

const notificationTextVariants = {
  collapsed: { opacity: 1, y: 0, pointerEvents: "none" },
  expanded: { opacity: 0, y: -16, pointerEvents: "none" },
};

const viewAllTextVariants = {
  collapsed: { opacity: 0, y: 16, pointerEvents: "none" },
  expanded: { opacity: 1, y: 0, pointerEvents: "none" },
};

export type Notification = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  notifications: Notification[];
  className?: string;
  onClick?: (message: string) => void;
};

function NotificationList(props: Props) {
  // Props
  const { notifications, className, onClick } = props;
  return (
    <motion.div
      className={cn(
        "w-full mx-2 md:w-xl mx-4 bg-slate-200 dark:bg-neutral-900 p-3 rounded-3xl space-y-3 border border-slate-300 hover:shadow-md",
        className,
      )}
      initial="collapsed"
      whileHover="expanded"
    >
      <div>
        {notifications.map((notification, i) => (
          <motion.div
            key={notification.id}
            className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-2 shadow-sm hover:shadow-lg transition-shadow duration-200 relative"
            variants={getCardVariants(i)}
            transition={transition}
            style={{
              zIndex: notifications.length - i,
            }}
          >
            <div className="flex flex-row gap-2 justify-between items-center">
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="text-sm font-medium">{notification.title}</h1>
                </div>
                <div className="text-xs text-neutral-500 font-medium">
                  <span>{notification.subtitle}</span>
                </div>
              </div>
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => onClick?.(notification.subtitle)}
              >
                <MousePointerClick className="size-5" />
                Probar
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 w-full">
        <span className="grid w-full">
          <motion.span
            className="text-sm font-medium text-md text-neutral-600 dark:text-neutral-300 row-start-1 col-start-1 flex flex-row justify-center"
            variants={notificationTextVariants}
            transition={textSwitchTransition}
          >
            ¿ Qué puedo hacer ?
          </motion.span>
          <motion.span
            className="text-sm font-medium text-md text-neutral-600 dark:text-neutral-300 flex items-center gap-1 cursor-pointer select-none row-start-1 col-start-1 flex flex-row justify-center"
            variants={viewAllTextVariants}
            transition={textSwitchTransition}
          >
            Estas preguntas podrían ayudarte
          </motion.span>
        </span>
      </div>
    </motion.div>
  );
}

export { NotificationList };
