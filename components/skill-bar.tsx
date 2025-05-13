"use client"

import { motion } from "framer-motion"

interface SkillBarProps {
  name: string
  level: number
  delay?: number
}

const SkillBar = ({ name, level, delay = 0 }: SkillBarProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm font-medium">{level}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <motion.div
          className="h-2.5 rounded-full bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, delay: delay, ease: "easeOut" }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </div>
  )
}

export default SkillBar
